<template>
  <div @click="next"
       @touchstart="OnTouchStart($event)"
       @touchmove="OnTouchMove($event)"
       @touchend="OnTouchEnd()">
    <Keypress v-if="parent === 'top'" key-event="keyup" :key-code="13" @success="next" /><!-- Enterキー -->
    <Keypress key-event="keyup" :key-code="37" @success="previous" /><!-- 左矢印キー -->
    <Keypress key-event="keyup" :key-code="39" @success="next" /><!-- 右矢印キー -->
    <Keypress key-event="keyup" :key-code="27" @success="start" /><!-- Escキー -->
    <pdf id="pdf" class="pdf" v-bind:src="slide.url" :page="page" @num-pages="lastpage = $event" />
    <MessageGrid v-if="parent === 'top'" :slide="slide" />
  </div>
</template>

<script>
import db from '@/firebase/firestore.js'
import pdf from 'vue-pdf';
import MessageGrid from '@/components/MessageGrid';

export default {

  components: {
    pdf,
    MessageGrid,
    Keypress: () => import('vue-keypress')
  },

  props: ['slide', 'parent'],

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

    // ページの監視
    this.observePage(this.setPage);
  },

  methods: {
    
    // 最初のページに戻る
    start: function() {
      this.page = 1;
      this.updatePage(this.page);
    },

    next: function() {
      
      // 最終ページでない時だけ、ページ数をインクリメントする
      if (this.page < this.lastpage) {
        this.page++;
      }

      this.updatePage(this.page);
    },

    previous: function() {

      // 最初のページでない時だけ、ページ数をデクリメントする
      if (this.page > 1) {
        this.page--;
      }

      this.updatePage(this.page);
    },

    updatePage: function(page) {

      // TOPページの子コンポーネントの時だけページを更新する
      if (this.parent !== 'top') {
        return;
      }

      // ページの更新
      db.collection('pages').doc(this.slide.id)
        .set({ page: page });
    },

    observePage: function(setPage) {

      // ページの監視
      db.collection('pages').doc(this.slide.id)
        .onSnapshot(function(doc) {
          setPage(doc.data().page);
      });
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
        this.previous();
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