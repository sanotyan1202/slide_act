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
        <ObjectFit>
          <pdf id="pdf" class="pdf" v-bind:src="slide.url" :page="page" @num-pages="lastpage = $event" />
        </ObjectFit>
        <EmojiGrid :parent="parent" :slide="slide" v-show="!isMessageList" />
        <MessageGrid :parent="parent" :slide="slide" v-show="!isMessageList" />
      </div>
      <div class="underbar">
        <div class="page-container">
          <img src="img/left.jpeg" class="prev" @click="prev" />
         <span class="pagenum">{{ this.page + "/" + this.lastpage }}</span>
          <img src="img/right.jpeg"  class="next" @click="next" />
        </div>
        <div>
          <span class="material-icons comment-list" 
            @click="isMessageList = true"
            v-show="!isMessageList"
          >
            list_alt
          </span>
          <span class="material-icons comment-babble"
            @click="isMessageList = false"
            v-show="isMessageList"
          >
            chat_bubble_outline
          </span>
        </div>
      </div>
    </div>
    <div v-if="isMessageList" class="messages-container">
      <MessageList :slideId="slide.id" />
    </div>
  </div>
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
    MessageList,
    ObjectFit,
},

  props: [
    'slide', 
    'parent', 
  ],

  data: function() {
    return {
      messageGrid: new Array(10),
      isMessageList: false,
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
    },

    next: function() {
      
      // 最終ページでない時だけ、ページ数をインクリメントする
      if (this.page < this.lastpage) {
        this.page++;
      }
    },

    prev: function() {

      // 最初のページでない時だけ、ページ数をデクリメントする
      if (this.page > 1) {
        this.page--;
      }
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
  min-width: 75%; /* メッセージリスト表示時 */
  display: flex;
  flex-direction: column;
}

.pdf-container {
  background-color: black;
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
  z-index: 1; /* スライドが微妙にはみ出ることがあるので被せて隠す */
}

.page-container {
  display: inline-flex;
  align-items: center;
}

.prev {
  margin-bottom: -1.5px;
  width: 1rem;
}

.prev:hover {
  cursor: pointer;
}

.next {
  margin-bottom: -1.5px;
  width: 1rem;
}

.next:hover {
  cursor: pointer;
}

.pagenum {
  margin: auto 10px;
}

.comment-list:hover {
  cursor: pointer;
}
.comment-babble:hover {
  cursor: pointer;
}

.messages-container {
  margin-left: 1%;
  height: 100%;
  width: 24%;
}

</style>