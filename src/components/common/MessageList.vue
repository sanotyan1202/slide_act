<template>
  <div class="message-list-container">
    <div class="header">
      Messages
    </div>
    <div class="message-row" v-for="message in messages" :key="message.id">
      <span v-if="message.name!=''">{{ message.name }} : </span>{{ message.message }}
    </div>
  </div>
</template>

<script>
import db from '@/firebase/firestore.js'

export default {

  props: ['slideId'],

  data: function() {
    return {
      dateOfVisit: new Date(),
      messages: [],
    }
  },

  mounted: async function() {
    // 過去のメッセージ取得
    this.getMessages();

    // 新規メッセージの監視
    this.observeMessages(this.unShiftMessage);
    this.observeEmojis(this.unShiftMessage);
  },

  methods: {
    getMessages: async function() {

      // メッセージ一覧、絵文字一覧を一括で扱う変数
      const messages = [];

      // メッセージ一覧の取得
      const messagesSnapshot = await db.collection('messages')
                                       .where("slideId", "==", this.slideId)
                                       .get();

      messagesSnapshot.forEach(doc => {
        const message = {
          id: doc.id,
          ...doc.data(),
        };
        messages.push(message);
      });

      // 絵文字一覧を取得し、メッセージとして扱う
      const emojisSnapshot = await db.collection('emojis')
                               .where("slideId", "==", this.slideId)
                               .get();

      emojisSnapshot.forEach(doc => {
        const message = {
          id: doc.id,
          name: '',
          slideId: doc.data().slideId,
          message: doc.data().emoji,
          createdAt: doc.data().createdAt,
        };
        messages.push(message);
      });

      // メッセージと絵文字を合わせて作成日の昇順にする
      this.messages = messages.sort((a, b) => {
        return b.createdAt.seconds - a.createdAt.seconds
      });
    },

    observeMessages: async function(unShiftMessage) {
      db.collection('messages')
        .where('slideId', '==', this.slideId)
        .orderBy('createdAt')
        .startAt(this.dateOfVisit)
        .onSnapshot(function(snapshot) {
          snapshot.docChanges().forEach(function(change) {

          // 新規追加の時のみ、画面に表示する
          if (change.type === "added") {

            unShiftMessage({
              id: change.doc.id,
              ...change.doc.data(),
            });
          }
        });
      });
    },

    observeEmojis: function(unShiftMessage) {

      // メッセージの監視
      db.collection('emojis')
        .where('slideId', '==', this.slideId)
        .orderBy('createdAt')
        .startAt(this.dateOfVisit)
        .onSnapshot(function(snapshot) {
        snapshot.docChanges().forEach(function(change) {

          // 新規追加の時のみ、画面に表示する
          if (change.type === "added") {
            unShiftMessage({
              id: change.doc.id,
              name: '',
              slideId: change.doc.data().slideId,
              message: change.doc.data().emoji,
              createdAt: change.doc.data().createdAt,
            });
          }
        });
      })
    },

    unShiftMessage: function(message) {
      this.messages.unshift(message);
    }
  }
}
</script>

<style scoped>

.message-list-container {
  width: 100%;
  background-color: #e3eaf1;
  box-sizing: border-box;
  border-radius: 5px;
  overflow-y: scroll;
}
.header {
  background-color: #2b3e4f;
  color: white;
  font-weight: bold;
  padding: 5px;
}


.message-row {
  margin: 0 10px;
  padding: 7px;
  text-align: left;
  box-sizing: border-box;
  border-bottom: 1px dotted #c1c1c1;
  margin-bottom: -1px;
}
</style>