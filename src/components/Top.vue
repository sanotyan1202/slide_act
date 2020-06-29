<template>
  <div id="top" class="top">
    <div class="container">
      <div class="row title-container">
        <h1 class="title">Slide Act</h1>
        <div class="description">
          プレゼンを活性化するWebサービス
        </div>
      </div>
      <div v-if="uploaded" class="row browser">
        閲覧用URL<br/>
        {{browserUrl}}
      </div>
      <div class="row">
        <div v-show="!uploaded" class="six columns offset-by-three columns">
          <PDFUploader v-on:give-slide="setSlide" />
        </div>
        <div v-if="uploaded" class="four columns offset-by-four columns" >
          <div id="slide-show-container" :style="styles">
            <SlideShow :slide="slide" :parent="'top'" />
          </div>
        </div>
      </div>
      <div class="row">
        <a class="button button-primary" v-show="uploaded" @click="act">Act</a>&emsp;
        <a class="button button-danger" v-show="uploaded" @click="del">Del</a>
      </div>
    </div>
  </div>
</template>

<script>
import utils from '@/common/utils.js'
import storage from '@/firebase/storage.js'
import PDFUploader from '@/components/PDFUploader';
import SlideShow from '@/components/SlideShow';

export default {

  components: {
    PDFUploader,
    SlideShow,
  },

  data: function() {
    return {
      slide: null,
      userId: '',
      padding: 0,
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
      // ファイルアップロード済:true 未:false
      return this.slide !== null;
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
.title-container {
  padding-top:150px;
  margin-bottom: 50px;
}

.post-slide-container {
  margin-bottom: 20px;
}

#slide-show-container {
  position: relative;
  content: "";
  display: block;
  clear: both;
  margin: 20px 30px 20px 30px;
  box-shadow: 0 0 5px #2b3e50;
}

#slide-show-container:fullscreen {
  --padding:0;
  padding-left: var(--padding);
  padding-right: var(--padding);
}

.button-danger {
  background-color: #dd6060;
  border-color: #dd6060;
  color: white;
}

.button-danger:hover {
  background-color: #ba5050;
  border-color: #ba5050;
  color: white;
}

input#slide-id {
  width: 80%;
  max-width: 450px;
}
</style>