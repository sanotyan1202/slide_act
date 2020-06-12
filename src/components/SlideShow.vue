<template>
  <div @click="next">
    <Keypress v-if="fullscreen" key-event="keyup" :key-code="13" @success="next" /><!-- Enterキー -->
    <Keypress key-event="keyup" :key-code="37" @success="previous" /><!-- 左矢印キー -->
    <Keypress key-event="keyup" :key-code="39" @success="next" /><!-- 右矢印キー -->
    <Keypress key-event="keyup" :key-code="27" @success="start" /><!-- Escキー -->
    <pdf id="pdf" class="pdf" v-bind:src="slide.url" :page="page" 
      @num-pages="lastpage = $event"></pdf>
    <MessageGrid v-if="fullscreen" :slide="slide" />
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

  props: ['slide', 'state'],

  data: function() {
    return {
      messageGrid: new Array(10),
      page: 1,
      lastpage: 0
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
      this.pudatePage(this.page);
    },

    // ページを進める
    next: function() {
      
      // 最終ページでない時だけ、ページ数をインクリメントする
      if (this.page < this.lastpage) {
        this.page++;
      }

      this.updatePage(this.page);
    },

    // ページを戻す
    previous: function() {

      // 最初のページでない時だけ、ページ数をデクリメントする
      if (this.page > 1) {
        this.page--;
      }

      this.updatePage(this.page);
    },

    // 現在のページ番号を登録する
    updatePage: function(page) {

      // TOPページの子コンポーネントの時だけページを更新する
      if (this.state !== 'fullscreen') {
        return;
      }

      // ページの更新
      db.collection('pages').doc(this.slide.id)
        .set({ page: page });
    },

    // ページ番号を監視し、更新されたらページを移動する
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
  },
  computed: {
    fullscreen: function() {
      return this.state === 'fullscreen';
    }
  }
}
</script>