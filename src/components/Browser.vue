<template>
  <div class="container">
    <meta name="viewport" content="width=device-width,initial-scale=1,user-scalable=no" />
    <div class="row">
      <div class="eight columns offset-by-two columns">
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
          <div class="nine columns">
            <div class="message-box-container">
              <div class="message-box-header">Message</div> 
              <input type="text" class="message-box"
              v-model="message" @keydown.enter="addMessage($event.keyCode)"
              placeholder="Input and Enter" maxlength="50">
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

export default {

  components: {
    SlideShow
  },

  data: function() {
    return {
      slide: null,
      message: '',
      name: ''
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
  },

  computed: {
    get: function() {
      return this.slide !== null;
    }
  }
}
</script>
<style>

  #slide-show-container {
    margin-top: 30px;
    box-shadow: 0 0 5px #2b3e50;
  }
  /* メッセージ入力欄 */
  .message-box-container {
    margin-top:30px;
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

</style>