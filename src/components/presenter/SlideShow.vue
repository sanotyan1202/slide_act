<template>
      <ObjectFit
        @click="next"
        @click.right.prevent="prev"
        @touchstart="OnTouchStart($event)"
        @touchmove="OnTouchMove($event)"
        @touchend="OnTouchEnd()"
      >
        <pdf id="pdf" class="pdf" v-bind:src="slide.url" :page="page" @num-pages="lastpage = $event" />
        <EmojiGrid :parent="parent" :slide="slide" v-if="messageShow" />
        <MessageGrid :parent="parent" :slide="slide" v-if="messageShow" />
        <div id="keypress-group">
          <Keypress key-event="keyup" :key-code="13" @success="next" /><!-- Enterキー -->
          <Keypress key-event="keyup" :key-code="37" @success="prev" /><!-- 左矢印キー -->
          <Keypress key-event="keyup" :key-code="39" @success="next" /><!-- 右矢印キー -->
          <Keypress key-event="keyup" :key-code="27" @success="start" /><!-- Escキー -->
        </div>
        <div v-if="!messageShow" class="messages-container">
          <MessageList :slideId="$route.params.slideId" />
        </div>
      </ObjectFit>
</template>

<script>
import db from '@/firebase/firestore.js'
import pdf from 'vue-pdf';
import MessageGrid from '@/components/common/MessageGrid';
import EmojiGrid from '@/components/common/EmojiGrid';
import MessageList from '@/components/common/MessageList';
import ObjectFit from '@/components/common/ObjectFit.vue';

export default {

  components: {
    pdf,
    MessageGrid,
    EmojiGrid,
    Keypress: () => import("vue-keypress"),
    MessageList,
    ObjectFit
},

  props: [
    'slide', 
    'parent', 
    'messageShow',
  ],

  data: function() {
    return {
      messageGrid: new Array(10),
      page: 1,
      lastpage: 0,
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

  methods: {
    
    // 最初のページに戻る
    start: function() {
      this.page = 1;
      this.updatePage(this.page);
    },

    next: function() {
      
      console.log(this.page)
      console.log(this.lastpage)
      // 最終ページでない時だけ、ページ数をインクリメントする
      if (this.page < this.lastpage) {
        this.page++;
      }

      this.updatePage(this.page);
    },

    prev: function() {

      // 最初のページでない時だけ、ページ数をデクリメントする
      if (this.page > 1) {
        this.page--;
      }

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
}
</script>

<style scoped>
.pdf {
  width: 100%;
  box-shadow: 0 0 5px #2b3e50;
}

.messages-container {
  margin-left: 1%;
  height: 100%;
  width: 19%;
}

</style>