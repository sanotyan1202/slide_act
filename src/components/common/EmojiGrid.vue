<template>
  <div class="emoji-river">
    <div class="emoji-row" v-for="(emojiRow, index) in emojiGrid" :key="index">
      <div class="emoji-col" v-for="(emojiBox, index) in emojiRow" :key="index">
        <transition name="fade">
          <div v-if="emojiBox !== null" class="emoji-float" :style="styles">
            {{emojiBox.emoji}}
          </div>
        </transition>
      </div>
    </div>
  </div>
</template>

<script>
import db from '@/firebase/firestore.js'

export default {

  data: function() {
    return {
      dateOfVisit: new Date(),
      emojiGrid: [],
      styles: {},
      windowWidth: window.innerWidth,
    }
  },
  props: ['slide', 'parent'],
  
  created: function () {
    // ブラウザ幅の変更を感知
    window.addEventListener('resize', this.handleResize)

    this.handleResize

    // メッセージグリッドの初期化
    this.initEmojiGird();

    // メッセージの監視
    this.observeEmoji(this.floatEmoji);
  },

  mounted: function() {

    // 絵文字Gridの幅の変更を監視して、絵文字サイズを可変にする
    const col = document.querySelector(".emoji-col");    
    const observer = new MutationObserver(() => {
      this.handleResize
    });
    const options = {
      attriblutes: true,
      attributeFilter: ["style"]
    };
    observer.observe(col, options);

    // 絵文字のフォントサイズを設定
    this.setFontSize();
  },

  methods: {

    initEmojiGird: function() {
      
      let rowMax = 0;
      let colMax = 0;

      if (this.isNarrow) {
        // スマホ画面の分割
        rowMax = 10;
        colMax = 10;
      } else {
        // PC画面の分割
        rowMax = 6;
        colMax = 14;
      }

      this.emojiGird = new Array(rowMax).fill(null);
      for(let row = 0; row < rowMax; row++){
        this.emojiGrid[row] = new Array(colMax).fill(null);
      }
    },

    handleResize: function() {
      this.windowWidth = window.innerWidth;

      // メッセージグリッドの初期化
      this.initEmojiGird();

      // フォントサイズ変更
      this.setFontSize();
    },

    setFontSize: function() {

      // 絵文字グリッドの縦幅を取得
      const cellHeight = document.querySelector(".emoji-col").clientHeight;

      // 縦幅に合わせて文字サイズを変更
      const fontsize = cellHeight / 30;
      this.styles = {'--emoji-font-size': fontsize + "em" };
    },


    observeEmoji: function(floatEmoji) {

      // メッセージの監視
      db.collection('emojis')
        .where('slideId', '==', this.slide.id)
        .orderBy('createdAt')
        .startAt(this.dateOfVisit)
        .onSnapshot(function(snapshot) {
        snapshot.docChanges().forEach(function(change) {

          // 新規追加の時のみ、画面に表示する
          if (change.type === "added") {
            floatEmoji(change.doc.data());
          }
        });
      })
    },

    floatEmoji: function(emojiBox) {
      

      // グリッドのどの位置にメッセージを表示するかランダムで選択
      // すでにメッセージが表示されている場合は、別の位置にする
      let rowIndex = 0;
      let colIndex = 0;

      do  {
        rowIndex = Math.floor( Math.random() * (this.emojiGrid.length));
        colIndex = Math.floor( Math.random() * (this.emojiGrid[0].length));
      } while(this.emojiGrid[rowIndex][colIndex] !== null);
      
      // メッセージの表示
      this.setEmojiInGrid(rowIndex, colIndex, emojiBox);

      // 1秒後にメッセージを消去
      setTimeout((rowIndex, colIndex) => {
        this.setEmojiInGrid(rowIndex, colIndex, null);
      },
      1000, 
      rowIndex, 
      colIndex);
    },

    setEmojiInGrid: function(rowIndex, colIndex,emojiBox) {

      // Gridに値を設定
      let emojiRow = this.emojiGrid[rowIndex];
      emojiRow[colIndex] = emojiBox;
      this.emojiGrid.splice(rowIndex, 1, emojiRow);
    },
  },

  computed:  {
    isNarrow: function() {
      return this.windowWidth < 640;
    },
  }
}
</script>
<style scoped>
.emoji-river {
  position: absolute;
  top: 1rem;
  right: 1rem;
  bottom: 2rem;
  left: 1rem;
  pointer-events: none;
  display: flex;
  flex-direction: column;
}

.emoji-row {
  display: flex;
  flex: 1;
}

.emoji-col {
  flex:1
}

.emoji-float {
  --emoji-font-size:1em;
  background-color: transparent;
  border: none;
  font-size: var(--emoji-font-size);
  text-align: left;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}

.fade-enter, .fade-leave-to {
  opacity: 0;
}
</style>