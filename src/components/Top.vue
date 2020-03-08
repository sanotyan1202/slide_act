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
        <a class="button button-primary" @click.prevent="registSlide" v-bind:href="slidePath">Act</a>
      </div>
    </div>
</template>

<script>
import db from '@/firebase/firestore.js'

export default {

  data: function() {
    return {
      slideId: '',
      userId: ''
    }
  },

  created: function() {
    this.getUserId()
  },

  methods: {

    getUserId: function() {
      if(!localStorage.userId) {
        localStorage.userId = this.generateUuid()
      }
      this.userId = localStorage.userId
    },

    registSlide: function() {

      if(this.slideId.length == 0) {
        return false
      }

      const slideRef = db.collection('slides')

      console.log("aaa")
      console.log(db)
      console.log("bbb")

      const newSlide = {
        slideId: this.slideId,
        userId: this.userId,
        createdAt: db.FieldValue.serverTimestamp()
      }

      slideRef.add(newSlide)

      return true
    },

    generateUuid: function() {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'  
        .replace(/x/g, () => Math.floor(Math.random() * 16).toString(16))  
        .replace(/y/g, () => (Math.floor(Math.random() * 4) + 8).toString(16))  
        ;
    }
  },

  computed: {

    slidePath() {
      return "/" + this.slideId
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