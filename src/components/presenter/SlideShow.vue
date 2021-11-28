<template>
  <div
    @click="next"
    @click.right.prevent="prev"
    @touchstart="OnTouchStart($event)"
    @touchmove="OnTouchMove($event)"
    @touchend="OnTouchEnd()"
    class="pdf-message-list-container"
  >
    <div class="pdf-container">
      <ObjectFit>
        <pdf id="pdf" class="pdf" v-bind:src="slide.url" :page="page" @num-pages="lastpage = $event" />
      </ObjectFit>
      <EmojiGrid :parent="parent" :slide="slide" v-if="!isMessageList" />
      <MessageGrid :parent="parent" :slide="slide" v-if="!isMessageList" />
      <div id="keypress-group">
        <Keypress key-event="keyup" :key-code="13" @success="next" /><!-- Enterキー -->
        <Keypress key-event="keyup" :key-code="37" @success="prev" /><!-- 左矢印キー -->
        <Keypress key-event="keyup" :key-code="39" @success="next" /><!-- 右矢印キー -->
      </div>
    </div>
    <div v-if="isMessageList && isActing" class="message-list-container">
      <MessageList :slideId="slide.id" class="messages" :style="pdfSize" />
    </div>
  </div>
</template>

<script>
import db from '@/firebase/firestore.js'
import MessageGrid from '@/components/common/MessageGrid';
import EmojiGrid from '@/components/common/EmojiGrid';
import MessageList from '@/components/common/MessageList';
import pdf from 'vue-pdf';
import ObjectFit from '@/components/common/ObjectFit.vue';

export default {

  components: {
    MessageGrid,
    EmojiGrid,
    Keypress: () => import("vue-keypress"),
    MessageList,
    pdf,
    ObjectFit
},

  props: [
    'slide', 
    'parent',
    'isMessageList',
  ],

  data: function() {
    return {
      messageGrid: new Array(10),
      page: 1,
      lastpage: 0,
      isActing: false,
      pdfHeight: 100,
      swipe: {
        flag: false,
        threshold: 60,
        start: {
          x: 0
        },
        current: {
          x: 0
        },
        distance: {
          x: 0
        },
      },
    }
  },

  created: function () {

    // messageGird初期化
    for(let row = 0; row < 10; row++){
      this.messageGrid[row] = new Array(4).fill(null);
    }
  },

  mounted: function() {
    // フルスクリーン変更時のイベントを取得
    document.addEventListener("fullscreenchange", this.changeFullscreen, false);
    document.addEventListener("webkitfullscreenchange", this.changeFullscreen, false);
    document.addEventListener("mozfullscreenchange", this.changeFullscreen, false);
    document.addEventListener("MSFullscreenChange", this.changeFullscreen, false);
    
    // pdf要素のサイズ変更を監視する
    const pdfEl = document.querySelector("#pdf");
    const observer = new ResizeObserver((entries) => {
      this.pdfHeight = entries[0].contentRect.height;
    });
    observer.observe(pdfEl);
  },

  methods: {    
    next: function() {      
      // 最後のページの時はフルスクリーンを終了する
      if (this.page === this.lastpage) {
        document.exitFullscreen();
        return;
      }

      this.page++;
      this.updatePage(this.page);
    },

    prev: function() {

      // 最初のページの時は何もしない
      if (this.page === 1) {
        return;
      }

      this.page--;
      this.updatePage(this.page);
    },

    updatePage: function(page) {
      // ページの更新
      db.collection('pages').doc(this.slide.id)
        .set({ page: page });
    },

    setPage: function(page) {
      this.page = page;
    },

    changeFullscreen: function() {
      this.isActing = !this.isActing;
    },

    // スワイプでスライド遷移
    OnTouchStart: function (e) {
      this.swipe.flag = true;
      this.swipe.start.x = e.touches[0].pageX;
    },
    OnTouchMove: function (e) {
      this.swipe.current.x = e.touches[0].pageX;
      this.swipe.distance.x = this.swipe.current.x - this.swipe.start.x;
      if( this.swipe.flag && this.swipe.distance.x > 0 && this.swipe.distance.x >= this.swipe.threshold){
        this.prev();
        this.swipe.flag = false;
      }
      if( this.swipe.flag && this.swipe.distance.x < 0 && this.swipe.distance.x >= this.swipe.threshold * -1){
        this.next();
        this.swipe.flag = false;
      }
    },
    OnTouchEnd: function () {
      this.swipe.flag = false;
    },
  },
  computed : {
    pdfSize: function() {
      return {
        '--pdfHeight': this.pdfHeight + 'px',
       };
    },
  },
}
</script>

<style scoped>
.pdf-message-list-container {
  display: flex;
  width: 100%;
  height: 100%;
}
.pdf-container {
  width: 100%;
  min-width: 75%;
}

.pdf {
  box-shadow: 0 0 5px #2b3e50;
}

.message-list-container {
  margin-left: 1%;
  width: 24%;
  display: flex;
  align-items: center;
  height: 100%;
}

.messages {
  --pdfHeight: 100px;
  height: var(--pdfHeight);
}
</style>