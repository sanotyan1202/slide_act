<template>
  <transition name="fade">
    <div v-if="start" class="splash">
      <div class="container">
        <h1 class="top-message">
          <div class="top-note">登録不要！</div>
          あなたのプレゼンが劇的に楽しくなる
        </h1>
        <a href="javascript:void(0)" @click="start=false">
          <PlayIcon class="play-icon" />
        </a>
        <img class="title-image" src="img/title.png" alt="title" />
        <div class="features-container">
          <Features />
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import PlayIcon from '@/components/utils/ScalingPlayIcon';
import Features from '@/components/presenter/Features';

export default {

components: {
    PlayIcon,
    Features,
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
  top: 3.5rem;
  right: 0;
  left: 0;
  /* height: 45rem; */
  z-index: 98;
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

.features-container {
  margin-top: 5rem;
}

/* transition */
.fade-leave-active {
  transition: opacity 1s;
}

.fade-leave-to {
  opacity: 0;
}

</style>