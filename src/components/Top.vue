<template>
    <div class="container">
      <div class="row title-container">
        <h1 class="title">Slide Act</h1>
        <div class="description">
          スライドを活性化するWebサービス
        </div>
      </div>
      <div class="row">
        <div class="six columns offset-by-three columns">
          <PDFUploader v-show="uploaded" v-on:give-slide-id="setSlideId" />
          <pdf id="pdf" v-bind:src="encodedUrl" :page="6"></pdf>
        </div>
      </div>
      <div class="row">
        <a class="button button-primary" @click="act" >Act</a>
      </div>
    </div>
</template>

<script>
import utils from '@/common/utils.js';
// import db from '@/firebase/firestore.js';
import pdf from 'vue-pdf';
import PDFUploader from './PDFUploader.vue';

export default {

  components: {
    PDFUploader,
    pdf
  },

  data: function() {
    return {
      slideId: '',
      userId: ''
    }
  },

  created: function() {
    // ローカルストレージからユーザーIDとスライドIDを取得
    this.getUserId();
    this.getSlideId();
  },

  methods: {

    getUserId: function() {

      // ローカルストレージにユーザーIDが存在しない場合はランダムな文字列で生成
      if(!localStorage.userId) {
        localStorage.userId = utils.generateUuid();
      }

      // ローカルストレージからユーザーIDを取得
      this.userId = localStorage.userId;
    },

    getSlideId: function() {
      
      // ローカルストレージにスライドIDが存在する場合のみ設定
      if(localStorage.slideId) {
        this.slideId = localStorage.slideId;
      }
    },

    act: function() {
      const docEl = document.querySelector("#pdf");
      let requestFullScreen = docEl.requestFullscreen || docEl.mozRequestFullScreen || docEl.webkitRequestFullScreen || docEl.msRequestFullscreen;
      requestFullScreen.call(docEl);
      
    },


    setSlideId: function(slideId) {
      // ローカルストレージにスライドIDを設定
      localStorage.slideId = slideId;
      this.slideId = slideId;
    }
  },

  computed : {

    uploaded: function () {
      // ファイルアップロード済:true 未:false
      return this.slideId.length !== 0;
    },

    encodedUrl: function() {
      // const aa = "http://localhost:8888/pdfjs/web/viewer.html?file="
      // + encodeURIComponent("https://firebasestorage.googleapis.com/v0/b/slide-act.appspot.com/o/pdf%2Fe47791db-eb13-4213-970c-4b08387bbbf6?alt=media&token=7788c882-b244-4101-9606-c28168bcff83");
      // console.log(aa);
      // return aa;
      return "https://firebasestorage.googleapis.com/v0/b/slide-act.appspot.com/o/pdf%2Fe47791db-eb13-4213-970c-4b08387bbbf6?alt=media&token=7788c882-b244-4101-9606-c28168bcff83";
    }
  }
}
</script>

<style>

.title-container {
  margin-top: 100px;
  margin-bottom: 50px;
}

.post-slide-container {
  margin-bottom: 20px;
}

input#slide-id {
  width: 80%;
  max-width: 450px;
}
</style>