<template>
  <div class="container">
    <header>
      <Navbar :parent="'browser'" />
    </header>
    <main class="content">
      <div v-if="isSmartPhone" class="form-container" :class="{narrow: isNarrow}">
        <div class="flex-item message" :class="{narrow: isNarrow}">
          <div class="message-box-header">Message</div> 
          <input type="text" class="message-box"
            v-model="message" @keydown.enter="addMessage($event.keyCode)"
            placeholder="Input and Enter (Max:30)" maxlength="30" >
        </div>
      </div>
      <div class="slide-container">
        <SlideShow 
          v-if="this.slide != null" 
          :slide="slide" 
          :messageShow="true"
        />
      </div>
      <div v-if="!isSmartPhone" class="form-container" :class="{narrow: isNarrow}">
        <div class="flex-item name" :class="{narrow: isNarrow}">
          <div class="message-box-header">Name</div> 
          <input type="text" class="name-box"
          v-model="name" @keydown.enter="addName($event.keyCode)"
          placeholder="Your Name" maxlength="5">
        </div>
        <div class="flex-item message" :class="{narrow: isNarrow}">
          <div class="message-box-header">Message</div> 
          <input type="text" class="message-box"
            v-model="message" @keydown.enter="addMessage($event.keyCode)"
            placeholder="Input and Enter (Max:25)" maxlength="25" >
        </div>
        <div class="flex-item emoji">
            <TwemojiPicker
              :emojiData="emojiDataAll"
              :emojiGroups="emojiGroups"
              :skinsSelection="false"
              :searchEmojisFeat="true"
              :randomEmojiArray="emojiArray"
              @emojiUnicodeAdded="selectEmoji"
              searchEmojiPlaceholder="Search here."
              searchEmojiNotFound="Emojis not found."
              isLoadingLabel="Loading..."
            />
        </div>
        <div class="flex-item emoji">
            <TwemojiPicker
              :emojiData="emojiDataAll"
              :emojiGroups="emojiGroups"
              :skinsSelection="false"
              :searchEmojisFeat="true"
              :randomEmojiArray="emojiArray"
              @emojiUnicodeAdded="addEmoji"
              searchEmojiPlaceholder="Search here."
              searchEmojiNotFound="Emojis not found."
              isLoadingLabel="Loading..."
            />
            <span class="direct">direct</span>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import analytics from '@/firebase/analytics';
import db from '@/firebase/firestore.js';
import Navbar from '@/components/common/Navbar';
import EmojiAllData from '@kevinfaguiar/vue-twemoji-picker/emoji-data/ja/emoji-all-groups.json';
import EmojiGroups from '@kevinfaguiar/vue-twemoji-picker/emoji-data/emoji-groups.json';
import SlideShow from '@/components/participant/SlideShow';
import {TwemojiPicker} from '@kevinfaguiar/vue-twemoji-picker';

export default {
  components: {
    Navbar,
    TwemojiPicker,
    SlideShow,
},

  data: function() {
    return {
      slide: null,
      message: '',
      name: '',
      emojiArray: ['🙂'],
      showMessageList: true,
      windowWidth: window.innerWidth,
    }
  },

  created: function () {

    // スマホの場合、最初に名前を取得
    if (this.isSmartPhone) {
      this.name = window.prompt("あなたの名前を入力してください", "");
    }

    // ブラウザ幅の変更を感知
    window.addEventListener('resize', this.handleResize)

    // スライドを取得
    this.getSlide();
  },

  methods: {

    handleResize: function() {
      this.windowWidth = window.innerWidth;
    },

    getSlide: async function () {
      // スライドの取得
      const slideId =this.$route.params.slideId;
      const doc = await db.collection('slides').doc(slideId).get();
      this.slide = doc.data();
      this.slide.id = doc.id;
    },

    addName: function(keyCode) {

      // 日本語確定Enterを無視
      if(keyCode !== 13) {
        return;
      }

      // フォーカス外し
      document.activeElement.blur();
    },

    addMessage: function(keyCode) {

      // 日本語確定Enterを無視
      if(keyCode !== 13) {
        return;
      }

      // フォーカス外し
      document.activeElement.blur();

      // 未入力チェック
      if(this.message.length === 0) {
        return;
      }
      
      // メッセージの登録
      db.collection('messages').add({
        slideId: this.slide.id,
        name: this.name,
        message: this.message,
        createdAt: new Date()
      });

      this.message = "";
      analytics.logEvent('message');
    },

    addEmoji: function(emoji) {
      // メッセージの登録
      db.collection('emojis').add({
        slideId: this.slide.id,
        emoji: emoji,
        createdAt: new Date()
      });
    },
    
    selectEmoji: function(emoji) {
      this.message += emoji;
    },
  },

  computed: {
    emojiDataAll: function() {
        return EmojiAllData;
    },
    emojiGroups: function() {
      return EmojiGroups;
    },
    isNarrow: function() {
      // ブラウザの幅がスライドの幅より小さい場合true
      return this.windowWidth < 640;
    },
    isSmartPhone: function() {
      return navigator.userAgent.match(/iPhone|Android.+Mobile/);
    },
  }
}
</script>
<style>
.content {
  display: flex;
  flex-direction: column;
}

.slide-container {
  height: 70vh;
}

/* メッセージ入力欄 */
.form-container {
  align-self: flex-end;
  display: flex;
  width: 100%;
  margin: 2rem auto 0 auto;
}

.form-container.narrow {
  flex-direction: column;
}

.flex-item {
  height: 2rem;
  background-color: transparent;
}

.flex-item.narrow {
  height: initial;
  width: 95% !important;
}

.flex-item.name {
  width: 20%;
  box-sizing:border-box;
  margin-right: 10px;
}

.flex-item.message {
  width: 75%;
}

.flex-item.emoji {
  padding-top: 2rem;
}

.message-box-header {
  font-weight: bold;
  color :#2b3e50;
  text-align: left;
  margin: 0.5rem 0;
}

input.name-box {
  width: 100%;
  height: 2rem;
  border: none;
  border-bottom: 1px solid #2b3e50;
  background: transparent;
  color: #2b3e50;
  font-weight: bold;
  outline: none;
}

input.name-box:focus {
  border-bottom: 1px solid rgb(0, 140, 140);
}

input.message-box {
  width: 100%;
  height: 2rem;
  border: none;
  border-bottom: 1px solid #2b3e50;
  background: transparent;
  color: #2b3e50;
  font-weight: bold;
  padding-right: 50px;
  outline: none;
}

input.message-box:focus {
  border-bottom: 1px solid rgb(0, 140, 140);
}

img.emoji {
  width:20px !important;
  height:20px !important;
}

#btn-emoji-default {
  height: 0 !important;
}

.direct {
  font-size: 0.7rem;
  vertical-align: top;
}
</style>