<template>
  <div class="container">
    <header>
      <Navbar :parent="'top'" />
    </header>
    <main class="content">
      <Splash />
      <div class="logo-container">
        <a class="logo-container" href="/">
        <img class="logo" src="img/logo2.png" alt="logo">
        </a>
      </div>
      <div v-if="!uploaded" class="uploading">
        <p class="description">スライドをPDF化して下の枠にドラッグ&amp;ドロップしてください</p>
        <div class="pdf-uploader-container" >
          <PDFUploader v-on:give-slide="setSlide" />
        </div>
        <p class="description">PDF化のやり方は以下を参照してください</p>
        <div class="to-pdf-container">
          <HowToPdf />
        </div>
      </div>
      <div v-if="uploaded" class="uploaded">  
        <p class="description"> 参加者に以下の参加者用URLを配布してスライドショーを開始してください</p>
        <p class="description">
          {{browserUrl}}
          <a href="javascript:void(0)" class="copy" v-clipboard:copy="browserUrl" @click="copyName = 'copied!'">{{copyName}}</a>
        </p>
        <div id="slide-show-container">
          <SlideShow 
          :slide="slide" 
          :messageShow="true"
          :isMessageList="messageType === 'list'"
          />
        </div>
        <div class="message-button-container">
          <label>
            <input type="radio" name="message" value="babble" v-model="messageType">
            <span class="label-body">ふきだし表示</span>
          </label>
          <label>
            <input type="radio" name="message" value="list" v-model="messageType">
            <span class="label-body">リスト表示</span>
          </label> 
       </div>
        <div class="act-button-container">
          <a class="button-primary" @click="act">スライドショーの開始</a>&emsp;
          <a class="button-danger" @click="del">削除</a>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import utils from '@/common/utils.js';
import analytics from '@/firebase/analytics';
import storage from '@/firebase/storage.js';
import Navbar from '@/components/common/Navbar';
import Splash from '@/components/presenter/Splash';
import HowToPdf from '@/components/presenter/HowToPdf';
import PDFUploader from '@/components/presenter/PDFUploader';
import SlideShow from '@/components/presenter/SlideShow';
import VueClipboard from 'vue-clipboard2';
import Vue from 'vue';

Vue.use(VueClipboard)

export default {

  components: {
    Navbar,
    Splash,
    HowToPdf,
    PDFUploader,
    SlideShow,
  },

  data: function() {
    return {
      slide: null,
      userId: '',
      paddingSide: 0,
      paddingUpDown: 0,
      copyName: 'copy',
      messageType: 'babble',
    }
  },

  created: function() {

    // ユーザーIDの作成
    this.createUserId();

    // ローカルストレージからスライドIDを取得
    this.getSlide();
  },

  methods: {

    // ユーザーIDの作成
    createUserId: function() {
      // ローカルストレージに、ユーザーIDが存在しない場合のみ追加
      if(!localStorage.userId) {
        localStorage.userId = utils.generateUuid();
      }
    },

    // ローカルストレージからスライド情報を取得
    getSlide: function() {

      // ローカルストレージにスライドIDが存在する場合のみ設定
      if(localStorage.slide) {
        this.slide = JSON.parse(localStorage.slide);
        this.step = 2;
      }
    },

    // フルスクリーンに
    act: function() {

      const docEl = document.querySelector("#slide-show-container");
      let requestFullScreen = docEl.requestFullscreen 
                           || docEl.mozRequestFullScreen 
                           || docEl.webkitRequestFullScreen 
                           || docEl.msRequestFullscreen;

      requestFullScreen.call(docEl);

      analytics.logEvent('act');
    },

    del: function() {
      
      // ファイルパスを取得
      const userId = localStorage.userId;
      const filepath = `pdf/${userId}/${this.slide.file}`;

      // Storage削除
      storage.ref(filepath).delete();

      // ローカルストレージ削除
      localStorage.removeItem('slide');

      // スライド消去
      this.slide = null;

      this.copyName = "copy";

      analytics.logEvent('delete')
    },

    setSlide: function(slide) {

      // ローカルストレージにスライドを保存
      localStorage.slide = JSON.stringify(slide);
      this.slide = slide;
    },
  },

  computed : {

    uploaded: function () { 
      return this.slide !== null
    },

    browserUrl: function() {
      return location.href + this.slide.id;
    }
  }
}
</script>

<style scoped>
img.logo {
  width: 18rem;
}

p.description {
  margin-top: 3rem;
  font-size: 1.3rem;
}

.pdf-uploader-container {
  margin-top: 2rem;
  margin-bottom: 5rem;
}

/** スライドショー */
#slide-show-container {
  position: relative;
  content: "";
  display: inline-block;
  clear: both;
  margin: 2rem auto;
  width: 25rem;
  height: 8rem;
}

.message-button-container {
  margin: 0 auto 2rem auto;
}

/** ボタン系 */
.copy {
  margin-left: 5px;
  padding: 2px;
  border: solid 0.5px #777b80;
  border-radius: 5px;
  color: #2c3e50;
  text-decoration: none;
}

.copy:hover {
  background-color:#eff2f3;
}

.button-primary {
  background-color: #58c4f0;
  padding: 0.7rem;
  color: white;
  border-radius: 4px;
  display: initial;
}

.button-primary:hover {
  background-color: #4eb4dc;
  cursor: pointer;
}

.button-danger {
  background-color: #f05858;
  padding: 0.7rem;
  color: white;
  border-radius: 4px;
  display: initial;
}

.button-danger:hover {
  background-color: #dc4e4e;
  cursor: pointer;
}
</style>