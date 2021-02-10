<template>
  <transition name="fade">
    <div v-if="start" class="splash">
      <h1 class="top-message">
        <div class="top-note">登録不要！</div>
        あなたのプレゼンが劇的に楽しくなる
      </h1>
      <a href="javascript:void(0)" @click="start = false">
        <PlayIcon class="play-icon" />
      </a>
      <img class="title-image" src="img/title.png" alt="title" />
    </div>
  </transition>
</template>

<script>
import PlayIcon from '@/components/utils/ScalingPlayIcon';

export default {

components: {
    PlayIcon,
  },

  data: function() {
    return {
      start: true,
    }
  },
}
</script>

<style scoped>
.splash {
  position: absolute;
  top: 4rem;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 99;
  background-color: white;
}

.top-note {
  font-size: 1.8rem;
  margin-left: -41rem;
  margin-bottom: -0.6rem;
}

.top-message {
  font-size:3rem;
}

.title-image {
  margin-top: -11rem;
  width: 50rem;
}

.play-icon {
  position:absolute;
  width:7rem;
  top:28rem;
  left:0;
  right:0;
  margin: auto;
}

/* transition */
.fade-leave-active {
  transition: opacity 1s;
}

.fade-leave-to {
  opacity: 0;
}
</style>