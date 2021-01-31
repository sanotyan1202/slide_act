<template>
  <div class="container">
    <meta name="viewport" content="width=device-width,initial-scale=1,user-scalable=no" />
    <div class="row content">
      <div class="eight columns offset-by-two columns">
        <a href="/">
          <img id="logo" src="img/logo.png" />
        </a>
        <div id="slide-show-container" @click.prevent="1">
          <SlideShow v-if="get" :slide="slide" :parent="'browser'" />
        </div>
        <div class="form">
          <div class="three columns">
            <div class="message-box-container">
              <div class="message-box-header">Name</div> 
              <input type="text" class="message-box"
              v-model="name" placeholder="Your Name" maxlength="5">
            </div>
          </div>
          <div class="eight columns">
            <div class="message-box-container">
              <div class="message-box-header">Message</div> 
              <input type="text" class="message-box"
                v-model="message" @keydown.enter="addMessage($event.keyCode)"
                placeholder="Input and Enter (Max:40)" maxlength="40" >
          </div>
          </div>
          <div class="one column">
            <div class="emoji-picker-container">
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
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import db from '@/firebase/firestore.js'
import SlideShow from '@/components/SlideShow';
import {TwemojiPicker} from '@kevinfaguiar/vue-twemoji-picker';
import EmojiAllData from '@kevinfaguiar/vue-twemoji-picker/emoji-data/ja/emoji-all-groups.json';
import EmojiGroups from '@kevinfaguiar/vue-twemoji-picker/emoji-data/emoji-groups.json';

export default {

  components: {
    SlideShow,
    TwemojiPicker,
  },

  data: function() {
    return {
      slide: null,
      message: '',
      name: '',
      emojiArray: ['🙂'],
    }
  },

  created: function () {
    // スライドを取得
    this.getSlide();
  },

  methods: {

    getSlide: async function () {
      // スライドの取得
      const slideId =this.$route.params.slideId;
      const doc = await db.collection('slides').doc(slideId).get();
      this.slide = doc.data();
      this.slide.id = doc.id;
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
      
      // 名前が未入力ならNO NAME
      if (this.name.length === 0) {
        this.name = 'NO NAME';
      }

      // メッセージの登録
      db.collection('messages').add({
        slideId: this.slide.id,
        name: this.name,
        message: this.message,
        createdAt: new Date()
      });

      this.message = "";
    },
    selectEmoji: function(emoji) {
      this.message += emoji;
    },
  },

  computed: {
    get: function() {
      return this.slide !== null;
    },
    emojiDataAll() {
        return EmojiAllData;
    },
    emojiGroups() {
      return EmojiGroups;
    }
  }
}
</script>
<style>

  #slide-show-container {
    box-shadow: 0 0 5px #2b3e50;
  }
  /* メッセージ入力欄 */
  .message-box-container {
    margin-top:25px;
    height: 65px;
    background-color: #fff;
  }

  .message-box-header {
    /* background-color: #2b3e50; */
    font-weight: bold;
    color :#2b3e50;
    text-align: left;
    padding-left: 10px;
  }

  input.message-box {
    margin: 5px;
    width: 100%;
    height: 30px;
    border: none;
    border-bottom: 1px solid #2b3e50;
    background: transparent;
    border-radius: 0px;
    color: #2b3e50;
    font-weight: bold;
  }

  input.message-box:focus {
    border: none;
    border-bottom: 1px solid rgb(0, 140, 140);
    background: transparent;  
  }

  #logo {
    margin-top: 5px;
    width: 70px;
  }

  .emoji-picker-container {
    position: relative;
    left:-45px;
    top:50px;
  }

  img.emoji {
    width:20px !important;
    height:20px !important;
  }
  #btn-emoji-default {
    height: 0 !important;
  }
</style>