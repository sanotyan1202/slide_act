<template>
  <div class="container">
    <div class="content-container">
      <Splash v-show="!uploaded" />
      <div class="logo-container">
        <img class="logo" src="img/logo2.png" alt="logo">
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
        <p class="description"> 参加者に以下のURLを配布してください</p>
        <div class="row browser">
          {{browserUrl}}
          <a href="javascript:void(0)" class="copy" v-clipboard:copy="browserUrl" @click="copyName = 'copied!'">{{copyName}}</a>
        </div>
        <div id="slide-show-container" :style="styles">
          <SlideShow :slide="slide" :parent="'top'" />
        </div>
        <div class="row">
          <a class="button-primary" @click="act">開始</a>&emsp;
          <a class="button-danger" @click="del">削除</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import utils from '@/common/utils.js'
import storage from '@/firebase/storage.js'
import Splash from '@/components/presenter/Splash';
import HowToPdf from '@/components/presenter/HowToPdf';
import PDFUploader from '@/components/presenter/PDFUploader';
import SlideShow from '@/components/common/SlideShow';
import VueClipboard from 'vue-clipboard2';
import Vue from 'vue';

Vue.use(VueClipboard)

export default {

  components: {
    Splash,
    HowToPdf,
    PDFUploader,
    SlideShow,
  },

  data: function() {
    return {
      slide: null,
      userId: '',
      padding: 0,
      copyName: "copy",
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

      // 画面サイズ取得
      const screenWidth = window.parent.screen.width;
      const scrrenHeight = window.parent.screen.height;

      // PDFのサイズ取得
      const pdfHeight = docEl.clientHeight;
      const pdfWidth = docEl.clientWidth;

      // フルスクリーンにした時の倍率を計算
      const fullscreenRatio = screenWidth / pdfWidth;

      // フルスクリーン時のPDFの高さを計算
      const fullscreenPdfHeight = pdfHeight * fullscreenRatio;

      // 何倍すれば縦幅が収まるか計算
      const shrinkRatio = scrrenHeight / fullscreenPdfHeight;

      // 減らす横幅を計算
      const padding = screenWidth - (screenWidth * shrinkRatio);

      // 両側のpaddingを設定するので/2
      this.padding = padding / 2;

      let requestFullScreen = docEl.requestFullscreen 
                           || docEl.mozRequestFullScreen 
                           || docEl.webkitRequestFullScreen 
                           || docEl.msRequestFullscreen;
      requestFullScreen.call(docEl);
    },

    // TODO:エラー処理
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

    styles: function() {
      // CSS変数を設定
      return {'--padding': this.padding + 'px' };
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
.pdf-uploader-container {
  margin-top: 2rem;
  margin-bottom: 3rem;
}

.content-container {
  margin-top: 6rem;
}

p.description {
  margin-top: 4rem;
}

/** スライドショー */
#slide-show-container {
  position: relative;
  content: "";
  display: block;
  clear: both;
  box-shadow: 0 0 5px #2b3e50;
  width: 20rem;
  left: 0;
  right: 0;
  margin: 2rem auto;
}

#slide-show-container:fullscreen {
  --padding:0;
  padding-left: var(--padding);
  padding-right: var(--padding);
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
  padding: 7px;
  color: white;
  border-radius: 4px;
  display: initial;
}

.button-primary:hover {
  background-color: #4eb4dc;
  cursor: pointer;
}

.button-danger {
  background-color: #dd6060;
  border-color: #dd6060;
  padding: 7px;
  color: white;
  border-radius: 4px;
}

.button-danger:hover {
  background-color: #ba5050;
  border-color: #ba5050;
  cursor: pointer;
}
</style>