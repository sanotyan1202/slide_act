<template>
  <div @click="page++">
    <Keypress key-event="keyup" :key-code="13" @success="page++" /><!-- Enterキー -->
    <Keypress key-event="keyup" :key-code="37" @success="page--" /><!-- 左矢印キー -->
    <Keypress key-event="keyup" :key-code="39" @success="page++" /><!-- 右矢印キー -->
    <Keypress key-event="keyup" :key-code="27" @success="page=1" /><!-- Escキー -->
    <pdf id="pdf" v-bind:src="slide.url" :page="page" class="pdf"></pdf>
    <div class="message-river">
      <div class="row message-row" v-for="(messageRow, index) in messageGrid" :key="index">
        <div class="three columns message-col" v-for="(message, index) in messageRow" :key="index">
          <transition name="fade">
            <div v-if="message !== ''" class="message-float">
              <div class="message-float-header">Message</div> 
              {{message}}
            </div>
          </transition>
        </div>
      </div>
    </div>
    <!-- <div v-if="isOthers" class="message-box-container row">
      <div class="message-box-header">Message</div> 
      <input type="text" class="message-box" id="message" v-model="myMessage" @keydown.enter="addMessage($event.keyCode)">
    </div> -->
  </div>
</template>

<script>
import db from '@/firebase/firestore.js'
import pdf from 'vue-pdf';

export default {

  components: {
    pdf,
    Keypress: () => import('vue-keypress')
  },

  props: ['slide'],

  data: function() {
    return {
      dateOfVisit: new Date(),
      userId:'',
      slideId: this.$route.params.slideId,
      isOthers: true,
      myMessage:'',
      messageGrid: new Array(10),
      page:1,
    }
  },

  created: function () {

    // messageGird初期化
    for(let row = 0; row < 10; row++){
      this.messageGrid[row] = new Array(4).fill("");
    }
    
    // メッセージの監視
    this.observeMessage(this.floatMessage);

  },

  methods: {

    observeMessage: function(floatMessage) {

      // メッセージの監視
      db.collection('messages')
        .where('slideId', '==', this.slide.id)
        .orderBy('createdAt')
        .startAt(this.dateOfVisit)
        .onSnapshot(function(snapshot) {
        snapshot.docChanges().forEach(function(change) {
          // 新規追加の時のみ、画面に表示する
          if (change.type === "added") {
            floatMessage(change.doc.data().message);
          }
        });
      })
    },

    addMessage: function(keyCode) {

      // 日本語確定Enterを無視
      if(keyCode !== 13) {
        return;
      }

      // 未入力チェック
      if(this.myMessage.length === 0) {
        return;
      }

      // メッセージの登録
      db.collection('messages').add({
        slideId: this.slide.id,
        message: this.myMessage,
        createdAt: new Date()
      });

      this.myMessage = "";
    },

    floatMessage: function(message) {
      
      // メッセージグリッドの最小、最大行列数
      const rowMin = 0;
      const rowMax = 9;
      const colMin = 0;
      const colMax = 3;

      // 変数を用意
      let rowIndex = 0;
      let colIndex = 0;

      // グリッドのどの位置にメッセージを表示するかランダムで選択
      // すでにメッセージが表示されている場合は、別の位置にする
      do  {
        rowIndex = Math.floor( Math.random() * (rowMax + 1 - rowMin)) + rowMin;
        colIndex = Math.floor( Math.random() * (colMax + 1 - colMin)) + colMin;
      } while(this.messageGrid[rowIndex][colIndex].length != 0);
      
      // メッセージの表示
      this.setMessageInGrid(rowIndex, colIndex, message);

      // 4秒後にメッセージを消去
      setTimeout((rowIndex, colIndex) => {
        this.setMessageInGrid(rowIndex, colIndex, "")
      },
      4000, 
      rowIndex, 
      colIndex);
    },

    setMessageInGrid: function(rowIndex, colIndex, message) {

      // Gridに値を設定
      let messageRow = this.messageGrid[rowIndex];
      messageRow[colIndex] = message;
      this.messageGrid.splice(rowIndex, 1, messageRow);
    },
  },
}
</script>
<style>

  /* メッセージの川 */
  .message-river {
    position: absolute;
    top: 20px;
    bottom: 70px;
    left: 20px;
    right: 20px;
    pointer-events: none;
  }

  .message-row {
    height: 10%;
  }

  .message-col {
    height: 100%;
  } 

  /* メッセージフロート */
  /* .message-float-header {
    background-color: #2b3e50;
    color: #fff;
  }

  .message-float {
    background-color: #fff;
    color: #2b3e50;
    border: solid 0.5px;
    font-size: 15px;
    font-weight: bold;
    opacity: 0.93;
  } */

  .message-float-header {
    background-color: #4e4b42;
    color: #d4ccac;
  }

  .message-float {
    z-index: 99999;
    background-color: #d4ccac;
    color: #4e4b42;
    border: solid 0.5px;
    font-size: 15px;
    font-weight: bold;
    opacity: 0.93;
  }

  .fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
  }

  .fade-enter, .fade-leave-to {
    opacity: 0;
  }

  /* メッセージ入力欄 */
  /* .message-box-container {
    position: absolute;
    bottom: 0px;
    left: 0px;
    right: 0px;
    height: 65px;
    background-color: #fff;
  }

  .message-box-header {
    background-color: #2b3e50;
    font-weight: bold;
    color: #fff;
    text-align: left;
    padding-left: 10px;
  }

  input.message-box {
    margin: 5px;
    width: 90%;
    height: 30px;
    border: none;
    border-bottom: 1px solid #2b3e50;
    border-radius: 0px;
    background: transparent;
    color: #2b3e50;
    font-weight: bold;
  } */

  .message-box-container {
    position: absolute;
    bottom: 0px;
    left: 0px;
    right: 0px;
    height: 65px;
    background-color: #d4ccac;
  }

  .message-box-header {
    background-color: #4e4b42;
    font-weight: bold;
    color: #d4ccac;
    text-align: left;
    padding-left: 10px;
  }

  input.message-box {
    margin: 5px;
    width: 90%;
    height: 30px;
    border: none;
    border-bottom: 1px solid #4e4b42;
    border-radius: 0px;
    background: transparent;
    color: #4e4b42;
    font-weight: bold;
  }

  input.message-box:focus {
    border: none;
    border-bottom: 1px solid #4e4b42;
    background: transparent;  
  }

</style>