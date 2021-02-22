<template>
  <img id="scaling-play-icon" src="img/scale-play.png" alt="再生ボタン" />
</template>

<style scoped>
  #scaling-play-icon {
    animation: zoom-shrink 0.5s;
    transform-origin: 50% 50%;
    animation-direction: alternate;
    animation-iteration-count: infinite; 
  }

  @keyframes zoom-shrink {
    0%   { transform: scale(0.8); }
    100% { transform: scale(1); }
  }

  #scaling-play-icon:hover {
    cursor: pointer;
  }
</style>