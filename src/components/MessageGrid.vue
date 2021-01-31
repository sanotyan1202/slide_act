<template>
  <div>
    <audio id="se" src="audio/se.mp3"></audio>
    <div class="message-river">
      <div class="row message-row" v-for="(messageRow, index) in messageGrid" :key="index">
        <div class="three columns message-col" v-for="(messageBox, index) in messageRow" :key="index">
          <transition name="fade">
            <div v-if="messageBox !== null" class="message-float" :style="styles">
              <div class="message-float-header">{{messageBox.name}}</div> 
              {{messageBox.message}}
            </div>
          </transition>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import db from '@/firebase/firestore.js'

const rowMax = 5;
const colMax = 4;

export default {

  data: function() {
    return {
      dateOfVisit: new Date(),
      messageGrid: new Array(rowMax),
      styles: {},
    }
  },
  props: ['slide', 'parent'],
  
  created: function () {

    this.setFontSize();

    // messageGird初期化
    for(let row = 0; row < rowMax; row++){
      this.messageGrid[row] = new Array(colMax).fill(null);
    }

    // メッセージの監視
    this.observeMessage(this.floatMessage);
  },

  methods: {

    setFontSize: function() {
      const fontsize = this.parent === "browser" ? 1.0 : 1.4;
      this.styles = {'--message-font-size': fontsize + "vw" };
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
        rowIndex = Math.floor( Math.random() * (rowMax));
        colIndex = Math.floor( Math.random() * (colMax));
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
}
</script>
<style>
  .message-river {
    position: absolute;
    top: 20px;
    bottom: 70px;
    left: 20px;
    right: 20px;
    pointer-events: none;
  }

  .message-row {
    height: 20%;
  }

  .message-col {
    height: 100%;
  } 

  .message-float-header {
    background-color: #4c4732;
    color: #fff89c;
    width: 45%;
    font-size: 75%;
    position: relative;
    left: -1.2em;
    top: -0.5em;
    padding-left: 0.5em;
  }

  /* .message-float-header:after {
    content: "";
    position: absolute;
    right: -15px;
    bottom: 0px;
    width: 0px;
    height: 0px;
    margin: auto;
    border-style: solid;
    border-color: transparent transparent transparent #4c4732;
    border-width: 15px 0 15px 15px;
  }
 */
  .message-float {
    --message-font-size:1.5vw;
    background-color: #fffbe9;
    color: #3e3a12;
    border: solid 2px #908b81;
    font-size: var(--message-font-size);
    text-align: left;
    padding: 0.7em 0.5em 0.2em 0.5em;
  }

  .fade-enter-active, .fade-leave-active {
    transition: opacity .5s;
  }

  .fade-enter, .fade-leave-to {
    opacity: 0;
  }
</style>