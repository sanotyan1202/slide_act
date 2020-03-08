<template>
  <div>
    <iframe :src="slideUrl" frameborder="0" :width="calcWidth" :height="calcHeight">
    </iframe>
  </div>
</template>

<script>
export default {
  
  props: {
    slideId: String
  },

  computed: {
    
    slideUrl() {
      return "https://docs.google.com/presentation/d/e/"
           + this.slideId
           + "/embed?start=false&loop=false&delayms=3000"
    },

    calcWidth() {
      return window.innerWidth
    },

    calcHeight() {
      return window.innerHeight
    }
  }
}
</script>