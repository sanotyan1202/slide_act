<template>
  <div class="container">
    <div class="row title-container">
      <h1 class="title">Slide Act</h1>
      <div class="description">
        スライドを活性化するWebサービス
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
          <SlideShow :slide="slide" :state="state" />
        </div>
      </div>
    </div>
    <div class="row">
      <a class="button button-primary" v-show="uploaded" @click="act">Act</a>&emsp;
      <a class="button button-danger" v-show="uploaded" @click="del">Del</a>
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
    SlideShow
  },

  data: function() {
    return {
      slide: null,
      userId: '',
      padding: 0,
      state: '',
    }
  },

  created: function() {

    // ローカルストレージからスライドIDを取得
    this.getSlide();

    // フルスクリーン時のPDFのPaddingを計算
    this.setScreenPadding();
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

    // フルスクリーン時の左右のPaddingを設定
    setScreenPadding: function() {

      // スクリーンの画面サイズ取得
      const width = window.parent.screen.width;
      // const height = window.parent.screen.height;
      
      // PDFが4:3で、画面が16:9の場合のみ有効
      this.padding = width / 8;
    },

    // フルスクリーンに
    act: function() {
      const docEl = document.querySelector("#slide-show-container");
      let requestFullScreen = docEl.requestFullscreen 
                           || docEl.mozRequestFullScreen 
                           || docEl.webkitRequestFullScreen 
                           || docEl.msRequestFullscreen;
      requestFullScreen.call(docEl);
      this.state = 'fullscreen';
    },

    // ローカルストレージ、Storage、FirestoreからPDFの情報を削除
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

    // ローカルストレージにスライドを保存
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
  margin-top: 100px;
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