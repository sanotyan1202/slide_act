<template>
  <div class="slide-frame-container">
    <SlideFrame :slide-id="slideId" />
    <div class="message-river">
      <marquee class="message-flow" scrollamount="15">こんにちは</marquee>
    </div>
  </div>
</template>

<script>
import SlideFrame from './SlideFrame.vue'

export default {

  components: {
    SlideFrame
  },

  data: function() {
    return {
      slideId: '',
    }
  },

  created: function () {
    this.slideId = this.$route.params.slideId
  },
}
</script>

<style>
  .slide-frame-container {
    position: absolute;
    bottom: 0px;
    top: 0px;
  }

  .message-river {
    position: absolute;
    top: 400px;
    width: 100%;
  }

  .message-flow {
    color: #fff;
    font-family: YuGothicM;
    src: local('YuGothic-Medium'),  /* Mediumを明示的に指定 */
         local('Yu Gothic Medium'), /* Chrome用 */
         local('YuGothic-Regular'); /* Windows8.1ではMediumがないのでRegularを指定 */
    font-size: 50px;
    text-shadow: 1px 1px 0 #000,
                -1px 1px 0 #000,
                1px -1px 0 #000,
                -1px -1px 0 #000;
  }
</style>