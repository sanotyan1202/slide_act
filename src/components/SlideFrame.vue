<template>
  <iframe :src="slideUrl" frameborder="0" class="slide-frame" id="slide-frame"></iframe>
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
  }
}
</script>

<style>

.slide-frame {
  height: 100%;
  width: 100%;
}

</style>