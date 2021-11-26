<template>
  <div class="pdf-underbar-messages-container">
    <div class="pdf-underbar-container">
      <div class="pdf-container"
        @click="next"
        @click.right.prevent="prev"
        @touchstart="OnTouchStart($event)"
        @touchmove="OnTouchMove($event)"
        @touchend="OnTouchEnd()"
      >
        <MaxCentering>
          <pdf id="pdf" class="pdf" v-bind:src="slide.url" :page="page" @num-pages="lastpage = $event" />
        </MaxCentering>
        <EmojiGrid :parent="parent" :slide="slide" v-if="messageShow" />
        <MessageGrid :parent="parent" :slide="slide" v-if="messageShow" />
        <div id="keypress-group" v-if="parent === 'top'">
          <Keypress key-event="keyup" :key-code="13" @success="next" /><!-- Enterキー -->
          <Keypress key-event="keyup" :key-code="37" @success="prev" /><!-- 左矢印キー -->
          <Keypress key-event="keyup" :key-code="39" @success="next" /><!-- 右矢印キー -->
          <Keypress key-event="keyup" :key-code="27" @success="start" /><!-- Escキー -->
        </div>
      </div>
      <div class="underbar" v-if="parent !== 'top'">
        <img src="img/left.jpeg" class="prev" @click="prev" />
        {{ this.page + "/" + this.lastpage }}
        <img src="img/right.jpeg"  class="next" @click="next" />
      </div>
    </div>
    <div v-if="!messageShow" class="messages-container">
      <MessageList :slideId="$route.params.slideId" />
    </div>
  </div>
</template>

<script>
import db from '@/firebase/firestore.js'
import pdf from 'vue-pdf';
import MessageGrid from '@/components/common/MessageGrid';
import EmojiGrid from '@/components/common/EmojiGrid';
import MessageList from './MessageList';
import MaxCentering from './MaxCentering.vue';

export default {

  components: {
    pdf,
    MessageGrid,
    EmojiGrid,
    Keypress: () => import("vue-keypress"),
    MessageList,
    MaxCentering
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
.pdf-underbar-messages-container {
  width: 100%;
  height: 100%;
  display: flex;
}

.pdf-underbar-container {
  height: 100%;
  width: 100%;
  background-color: black;
  display: flex;
  flex-direction: column;
}

.pdf-container {
  position:relative;
  height: 100%;
  width: 100%;
  flex-grow: 2;
  display: flex;
  justify-content: center;
  align-items: center;
}

.pdf {
  width: 100%;
}

.underbar {
  background-color: white;
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  padding: 0.5rem;
  border: solid 2px #eaedf1;
}

.prev {
  width: 1rem;
  height: 1rem;
}

.prev:hover {
  cursor: pointer;
}

.next {
  width: 1rem;
  height: 1rem;
}

.next:hover {
  cursor: pointer;
}

.messages-container {
  margin-left: 1%;
  height: 100%;
  width: 19%;
}

</style>