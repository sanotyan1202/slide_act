<template>
  <div>
    <div class="slide-frame-container">
      <SlideFrame :slide-id="slideId" />
    </div>
    <div class="message-river">
      <div class="row message-row" v-for="(messageRow, index) in messageGrid" :key="index">
        <div class="three columns message-float" v-for="(message, index) in messageRow" :key="index">
          <transition name="fade">
            <span v-if="message !== ''">{{message}}</span>
          </transition>          
        </div>
      </div>
    </div>
    <div class="message-container">
      <input type="text" class="message-box" placeholder="message" id="message" v-model="myMessage" v-on:keydown.enter="floatMessasge($event.keyCode)">
    </div>
  </div>
</template>

<script>
import SlideFrame from './SlideFrame.vue'
import db from '@/firebase/firestore.js'

export default {

  components: {
    SlideFrame
  },

  data: function() {
    return {
      userId:'',
      slideId: '',
      isOthers: false,
      myMessage:'',
      messageGrid: new Array(10),
    }
  },

  created: function () {
    
    this.userId = localStorage.userId
    this.slideId = this.$route.params.slideId

    // 閲覧者か発表者か
    const slideRef = db.collection('slides')
                       .where('userId', '==', this.userId)
                       .where('slideId', '==', this.slideId)
    slideRef.get().then((doc) => {
      this.isOthers = doc.size == 0
    })
 
    // messageGird初期化
    for(let row = 0; row < 10; row++){
      this.messageGrid[row] = new Array(4).fill("");
    }
  },

  methods: {

    addMessage: function() {
      
      const messageRef = db.collection('messages')

      messageRef.add({
        slideId: this.slideId,
        message: this.message,
        createdAt: new Date()
      }).then(() => {
        console.log("success")
      }).catch((err) => {
        console.error(err)
      })
    },

    floatMessasge: function(keyCode) {
      
      // 日本語確定Enterを無視
      if(keyCode !== 13) return

      // 未入力チェック
      if(this.myMessage.length === 0) return

      // メッセージグリッドの最小、最大行列数
      const rowMin = 0
      const rowMax = 9
      const colMin = 0
      const colMax = 3

      // 最初のコメント位置
      let rowIndex = 5
      let colIndex = 2

      // グリッドのどの位置にメッセージを表示するかランダムで選択
      // すでにメッセージが表示されている場合は、別の位置にする
      while(this.messageGrid[rowIndex][colIndex].length != 0) {
        rowIndex = Math.floor( Math.random() * (rowMax + 1 - rowMin)) + rowMin
        colIndex = Math.floor( Math.random() * (colMax + 1 - colMin)) + colMin
      }
      
      // メッセージの表示
      this.messageGrid[rowIndex].splice(colIndex, 1, this.myMessage)
      this.myMessage = "";

      // 5秒後にメッセージを消去
      setTimeout((rowIndex, colIndex) => {
        let messageRow = this.messageGrid[rowIndex]
        messageRow[colIndex] = ""
        this.messageGrid.splice(rowIndex, 1, messageRow)
      }, 
      5000, 
      rowIndex, 
      colIndex)
    },
  }
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

  .message-float {
    height: 100%;
  } 

  .slide-frame-container {
    position: absolute;
    top: 0px;
    bottom: 0px;
    left: 0px;
    right: 0px;
  }

  .message-container {
    position: absolute;
    bottom: 0px;
    left: 0px;
    right: 0px;
    height:48px;
    background-color: #313335;
  }

  .message-box {
    margin: 5px;
    width: 90%;
  }

  .fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
  }
  .fade-enter, .fade-leave-to {
    opacity: 0;
  }
</style>