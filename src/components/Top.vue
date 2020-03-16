<template>
    <div class="container">
      <div class="row title-container">
        <h1 class="title">Slide Act</h1>
        <div class="description">
          スライドを活性化するWebサービス
        </div>
      </div>
      <div class="row">
        <div class="post-slide-container">
          <input type="text" placeholder="slide id" id="slide-id" v-model="slideId">
        </div>
      </div>
      <div class="row">
        <a class="button button-primary" @click.prevent="registSlide">Act</a>
      </div>
    </div>
</template>

<script>
import db from '@/firebase/firestore.js'

export default {

  data: function() {
    return {
      slideId: '',
      userId: '',
    }
  },

  created: function() {
    this.getUserId()
  },

  methods: {

    getUserId: function() {

      // ローカルストレージにユーザーIDが存在しない場合はランダムな文字列で生成
      if(!localStorage.userId) localStorage.userId = this.generateUuid()

      // ローカルストレージからユーザーIDを取得
      this.userId = localStorage.userId
    },

    registSlide: async function() {

      // 未入力チェック
      if(this.slideId.length == 0) return

      // スライド画面で自分のスライドか判定するため
      // スライドIDとユーザーIDを登録
      const slideRef = db.collection('slides')
      await slideRef.add({
        slideId: this.slideId,
        userId: this.userId,
        createdAt: new Date()
      }).then(() => {
        console.log("success")
      }).catch((err) => {
        console.error(err)
      })

      // スライド画面に遷移
      window.location.href = "/" + this.slideId
    },

    generateUuid: function() {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'  
        .replace(/x/g, () => Math.floor(Math.random() * 16).toString(16))  
        .replace(/y/g, () => (Math.floor(Math.random() * 4) + 8).toString(16))  
        ;
    }
  },
}
</script>

<style>

.title-container {
  margin-top: 100px;
  margin-bottom: 50px;
}

.post-slide-container {
  margin-bottom: 20px;
}

input#slide-id {
  width: 80%;
  max-width: 450px;
}
</style>