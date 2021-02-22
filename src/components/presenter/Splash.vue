<template>
  <transition name="fade">
    <div v-if="start" class="splash">
      <div class="container">
        <h1 class="top-message">
          <div class="top-note"><span class="underline">登録不要！</span></div>
          <span class="underline">あなたのプレゼンが劇的に楽しくなる</span>
        </h1>
        <a href="javascript:void(0)" @click="start=false">
          <PlayIcon class="play-icon" />
        </a>
        <img id="message1" class="message-image" src="img/message1.png" alt="message1" />
        <img id="message2" class="message-image" src="img/message2.png" alt="message2" />
        <img id="message3" class="message-image" src="img/message3.png" alt="message3" />
        <img class="title-image" src="img/title.jpeg" alt="title" />
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
  margin-top: -1rem;
  width: 55rem;
}

.play-icon {
  position:absolute;
  width:7rem;
  top:28rem;
  left:-2rem;
  right:0;
  margin: auto;
}

.message-image {
  position: absolute;
  width: 15rem;
}

#message1 {
  top: 29rem;
  left: -23rem;
  right:0;
  margin: auto;
  animation: message1 5.0s ease-out;
  animation-iteration-count: infinite; 
}

#message2 {
  top: 16rem;
  left: 11rem;
  right:0;
  margin: auto;
  animation: message2 8.0s ease-out;
  animation-iteration-count: infinite; 
}

#message3 {
  top: 14rem;
  left: -22rem;
  right:0;
  margin: auto;
  animation: message3 10.0s ease-out;
  animation-iteration-count: infinite; 
}

@keyframes message1 {
  0%   {opacity: 0%;}
  10%  {opacity: 0%;}
  30%  {opacity: 100%;}
  70%  {opacity: 100%;}
  90%  {opacity: 0%;}
  100% {opacity: 0%;}
}

@keyframes message2 {
  0%   {opacity: 0%;}
  20%  {opacity: 0%;}
  40%  {opacity: 100%;}
  80%  {opacity: 100%;}
  100%  {opacity: 0%;}
}

@keyframes message3 {
  0%   {opacity: 0%;}
  40%  {opacity: 0%;}
  60%  {opacity: 100%;}
  90%  {opacity: 100%;}
  100% {opacity: 0%;}
}


/* transition */
.fade-leave-active {
  transition: opacity 1s;
}

.fade-leave-to {
  opacity: 0;
}

</style>