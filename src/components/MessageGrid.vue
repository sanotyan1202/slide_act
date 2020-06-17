<template>
  <div>
    <audio id="se" src="audio/se.mp3"></audio>
    <div class="message-river">
      <div class="row message-row" v-for="(messageRow, index) in messageGrid" :key="index">
        <div class="three columns message-col" v-for="(messageBox, index) in messageRow" :key="index">
          <transition name="fade">
            <div v-if="messageBox !== null" class="message-float">
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

export default {

  data: function() {
    return {
      dateOfVisit: new Date(),
      messageGrid: new Array(10),
    }
  },

  props: ['slide'],

  created: function () {

    // messageGird初期化
    for(let row = 0; row < 10; row++){
      this.messageGrid[row] = new Array(4).fill(null);
    }

    // メッセージの監視
    this.observeMessage(this.floatMessage);
  },

  methods: {

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
      
      // メッセージグリッドの最小、最大行列数
      const rowMin = 0;
      const rowMax = 9;
      const colMin = 0;
      const colMax = 3;

      let rowIndex = 0;
      let colIndex = 0;

      // グリッドのどの位置にメッセージを表示するかランダムで選択
      // すでにメッセージが表示されている場合は、別の位置にする
      do  {
        rowIndex = Math.floor( Math.random() * (rowMax + 1 - rowMin)) + rowMin;
        colIndex = Math.floor( Math.random() * (colMax + 1 - colMin)) + colMin;
      } while(this.messageGrid[rowIndex][colIndex] !== null);
      
      // メッセージの表示
      this.setMessageInGrid(rowIndex, colIndex, messageBox);

      // 効果音再生
      this.play();

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
    height: 10%;
  }

  .message-col {
    height: 100%;
  } 

  /* 初期 */
  /* .message-float-header {
      background-color: #caffe9;
      color: #2b3e4f;
      border-radius: 10px 10px 0px 0px;
      border-bottom: solid 2px #8eb2a3;
  }

  .message-float {
    background-color: #caffe9;
    color: #2b3e50;
    border: solid 2px #8eb2a3;
    font-size: 150%;
    font-weight: bold;
    border-radius: 10px;
  } */

  .message-float-header {
    background-color: #4c4732;
    color: #fff89c;
    width: 100px;
    font-size: 90%;
    position: relative;
    left: -25px;
    top: -10px;
    padding-left: 10px;
    height: 30px;
  }

  .message-float-header:after {
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

  .message-float {
    background-color: #fffbe9;
    color: #3e3a12;
    border: solid 2px #908b81;
    font-size: 150%;
    text-align: left;
    padding: 15px 5px 5px 10px;
  }

  .fade-enter-active, .fade-leave-active {
    transition: opacity .5s;
  }

  .fade-enter, .fade-leave-to {
    opacity: 0;
  }
</style>