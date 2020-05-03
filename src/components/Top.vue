<template>
  <div class="container">
    <div class="row title-container">
      <h1 class="title">Slide Act</h1>
      <div class="description">
        スライドを活性化するWebサービス
      </div>
    </div>
    <div class="row">
      <div v-show="!uploaded" class="six columns offset-by-three columns">
        <PDFUploader v-on:give-slide="setSlide" />
      </div>
      <div v-if="uploaded" class="four columns offset-by-four columns" >
        <div id="slide-show-container">
          <SlideShow :slide="slide" />
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
import utils from '@/common/utils.js';
import db from '@/firebase/firestore.js';
import pdf from 'vue-pdf';
import storage from '@/firebase/storage.js'
import PDFUploader from '@/components/PDFUploader';
import SlideShow from '@/components/SlideShow';

// 4:3
export default {

  components: {
    PDFUploader,
    SlideShow,
    pdf
  },

  data: function() {
    return {
      slide: null,
      userId: ''
    }
  },

  created: function() {
    // ローカルストレージからスライドIDを取得
    this.getSlide();
    console.log(window.parent.screen);
  },

  methods: {

    getSlide: function() {
      
      // ローカルストレージにスライドIDが存在する場合のみ設定
      if(localStorage.slide) {
        this.slide = JSON.parse(localStorage.slide);
      }
    },

    act: function() {
      const docEl = document.querySelector("#slide-show-container");
      let requestFullScreen = docEl.requestFullscreen || docEl.mozRequestFullScreen || docEl.webkitRequestFullScreen || docEl.msRequestFullscreen;
      requestFullScreen.call(docEl);
    },

    del: function() {
      
      // Firesotre削除
      db.collection('slides').doc(this.slide.id).delete();

      // Storage削除
      storage.ref(this.slide.file).delete();

      // ローカルストレージ削除
      localStorage.clear();

      // スライド消去
      this.slide = null;
    },

    setSlide: function(slide) {
      // ローカルストレージにスライドを保存
      localStorage.slide = JSON.stringify(slide);
      this.slide = slide;
    }
  },

  computed : {

    uploaded: function () {
      // ファイルアップロード済:true 未:false
      return this.slide !== null;
    },
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

#slide-show-container {
  position: relative;
  content: "";
  display: block;
  clear: both;
  padding: 0px 30px 0px 30px;
  margin: -15px 0px 20px 0px;
}

#slide-show-container:fullscreen {
  padding: 0px 171px 0px 171px;
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