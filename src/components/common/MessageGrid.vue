<template>
  <div class="message-river">
    <div class="message-row" :class="{narrow: isNarrow}" v-for="(messageRow, index) in messageGrid" :key="index">
      <div class="message-col" :class="{narrow: isNarrow}" v-for="(messageBox, index) in messageRow" :key="index">
        <transition name="fade">
          <div v-if="messageBox !== null" class="message-float" :style="styles">
            <div v-if="!noname" class="message-float-header">{{messageBox.name}}</div> 
            {{messageBox.message}}
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
      messageGrid: [],
      styles: {},
      windowWidth: window.innerWidth,
    }
  },
  props: ['slide', 'parent'],
  
  created: function () {

    // ブラウザ幅の変更を感知
    window.addEventListener('resize', this.handleResize)

    // メッセージグリッドの初期化
    this.initMessageGird();

    // メッセージの監視
    this.observeMessage(this.floatMessage);
  },

  mounted: function() {
    // メッセージのフォントサイズを設定
    this.setFontSize();

    // メッセージGridの幅の変更を監視して、文字サイズを可変にする
    const col = document.querySelector(".message-col");    
    const observer = new MutationObserver(() => {
      this.handleResize
    });
    const options = {
      attriblutes: true,
      attributeFilter: ["style"]
    };
    observer.observe(col, options);

  },

  methods: {

    initMessageGird: function() {
      
      let rowMax = 0;
      let colMax = 0;

      if (this.isNarrow) {
        rowMax = 3;
        colMax = 2;
      } else {
        rowMax = 5;
        colMax = 4;
      }

      this.messageGird = new Array(rowMax).fill(null);
      for(let row = 0; row < rowMax; row++){
        this.messageGrid[row] = new Array(colMax).fill(null);
      }
    },

    handleResize: function() {
      this.windowWidth = window.innerWidth;

      // メッセージグリッドの初期化
      this.initMessageGird();

      // フォントサイズ変更
      this.setFontSize();
    },

    setFontSize: function() {
      // メッセージグリッドの横幅を取得
      const cellWidth = document.querySelector(".message-col").clientWidth;

      // 横幅に合わせて文字サイズを変更
      const fontsize = cellWidth / 400 + 0.6;
      this.styles = {'--message-font-size': fontsize + "rem" };
    },

    observeMessage: function(floatMessage) {

      // メッセージの監視
      db.collection('messages')
        .where('slideId', '==', this.slide.id)
        .orderBy('createdAt')
        .startAt(this.dateOfVisit)
        .onSnapshot(function(snapshot) {
        snapshot.docChanges().forEach(function(change) {

          // 新規追加の時のみ、画面に表示する
          if (change.type === "added") {
            floatMessage(change.doc.data());
          }
        });
      })
    },

    floatMessage: function(messageBox) {
      

      // グリッドのどの位置にメッセージを表示するかランダムで選択
      // すでにメッセージが表示されている場合は、別の位置にする
      let rowIndex = 0;
      let colIndex = 0;

      do  {
        rowIndex = Math.floor( Math.random() * (this.messageGrid.length));
        colIndex = Math.floor( Math.random() * (this.messageGrid[0].length));
      } while(this.messageGrid[rowIndex][colIndex] !== null);
      
      // メッセージの表示
      this.setMessageInGrid(rowIndex, colIndex, messageBox);

      // 効果音再生
      // this.play();

      // 4秒後にメッセージを消去
      setTimeout((rowIndex, colIndex) => {
        this.setMessageInGrid(rowIndex, colIndex, null);
      },
      4000, 
      rowIndex, 
      colIndex);
    },

    setMessageInGrid: function(rowIndex, colIndex, messageBox) {

      // Gridに値を設定
      let messageRow = this.messageGrid[rowIndex];
      messageRow[colIndex] = messageBox;
      this.messageGrid.splice(rowIndex, 1, messageRow);
    },

    play: function() {
      document.querySelector("#se").play();
    }
  },

  computed:  {
    isNarrow: function() {
      return this.windowWidth < 640;
    },
    noname: function() {
      return this.name === "";
    }
  }
}
</script>
<style scoped>
.message-river {
  position: absolute;
  top: 1rem;
  right: 1rem;
  bottom: 2rem;
  left: 1rem;
  pointer-events: none;
  display: flex;
  flex-direction: column;
}

.message-row {
  display: flex;
  flex: 1;
}

.message-col {
  flex:1
}

.message-float-header {
  background-color: #4c4732;
  color: #fff89c;
  width: 45%;
  font-size: 80%;
  position: relative;
  left: -1.2rem;
  top: -0.5rem;
  padding-left: 0.5rem;
  border-radius: 10px;
}

.message-float {
  --message-font-size:1em;
  border-radius: 5px;
  background-color: #fffbe9;
  color: #3e3a12;
  border: solid 2px #908b81;
  font-size: var(--message-font-size);
  text-align: left;
  padding: 0.7rem 0.5rem 0.2rem 0.5rem;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}

.fade-enter, .fade-leave-to {
  opacity: 0;
}
</style>