<template>
  <div class="container">
    <header>
      <Navbar :parent="'browser'" />
    </header>
    <main class="content">
      <div v-if="isSmartPhone" class="form-flex" :class="{narrow: isNarrow}">
        <div class="flex-item message" :class="{narrow: isNarrow}">
          <div class="message-box-header">Message</div> 
          <input type="text" class="message-box"
            v-model="message" @keydown.enter="addMessage($event.keyCode)"
            placeholder="Input and Enter (Max:30)" maxlength="30" >
        </div>
      </div>
      <div id="slide-show-container" :class="{narrow: isNarrow}" @click.prevent="1">
        <SlideShow v-if="get" :slide="slide" :parent="'browser'" />
      </div>
      <div v-if="!isSmartPhone" class="form-flex" :class="{narrow: isNarrow}">
        <div class="flex-item name" :class="{narrow: isNarrow}">
          <div class="message-box-header">Name</div> 
          <input type="text" class="message-box"
          v-model="name" @keydown.enter="addName($event.keyCode)"
          placeholder="Your Name" maxlength="5">
        </div>
        <div class="flex-item message" :class="{narrow: isNarrow}">
          <div class="message-box-header">Message</div> 
          <input type="text" class="message-box"
            v-model="message" @keydown.enter="addMessage($event.keyCode)"
            placeholder="Input and Enter (Max:30)" maxlength="30" >
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
      </div>
    </main>
  </div>
</template>

<script>
import analytics from '@/firebase/analytics';
import db from '@/firebase/firestore.js';
import Navbar from '@/components/common/Navbar';
import SlideShow from '@/components/common/SlideShow';
import {TwemojiPicker} from '@kevinfaguiar/vue-twemoji-picker';
import EmojiAllData from '@kevinfaguiar/vue-twemoji-picker/emoji-data/ja/emoji-all-groups.json';
import EmojiGroups from '@kevinfaguiar/vue-twemoji-picker/emoji-data/emoji-groups.json';

export default {
  components: {
    Navbar,
    SlideShow,
    TwemojiPicker,
  },

  data: function() {
    return {
      slide: null,
      message: '',
      name: '',
      emojiArray: ['🙂'],
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
    
    selectEmoji: function(emoji) {
      this.message += emoji;
    },
  },

  computed: {
    get: function() {
      return this.slide !== null;
    },
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
#slide-show-container {
  box-shadow: 0 0 5px #2b3e50;
  width: 40rem;
  left: 0;
  right: 0;
  margin: 1rem auto;
}

#slide-show-container.narrow {
  width:100% !important;
}

/* メッセージ入力欄 */
.form-flex {
  display: flex;
  width: 40rem;
  left: 0;
  right: 0;
  margin: auto;
}

.form-flex.narrow {
  flex-direction: column;
  width: 100% !important;
}

.flex-item {
  margin-right: 0.5rem;
  height: 2rem;
  background-color: #fff;
}

.flex-item.narrow {
  height: initial;
  width: 95% !important;
}


.flex-item.name {
  width: 20%;
}

.flex-item.message {
  width: 75%;
}

.flex-item.emoji {
  width: 5%;
  padding-top: 2rem;
}

.message-box-header {
  font-weight: bold;
  color :#2b3e50;
  text-align: left;
  margin: 0.5rem 0;
}

input.message-box {
  width: 100%;
  height: 2rem;
  border: none;
  border-bottom: 1px solid #2b3e50;
  background: transparent;
  color: #2b3e50;
  font-weight: bold;
}

input.message-box:focus {
  border: none;
  border-bottom: 1px solid rgb(0, 140, 140);
  background: transparent;  
}

img.emoji {
  width:20px !important;
  height:20px !important;
}

#btn-emoji-default {
  height: 0 !important;
}
</style>