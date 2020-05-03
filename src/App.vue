<template>
  <div id="app">
     <router-view />
  </div>
</template>

<script>
export default {
  name: 'App',
  // mounted: function() {
  //   var vm = this;
  //   window.addEventListener('keyup', function(event) {
  //     const key = event.keyCode;
  //     console.log("test");
  //     switch (key) {
  //       case 13:
  //         console.log("test2");
  //         vm.$broadcast('keyupEnter');
  //         break;
  //       case 37:
  //         console.log("test3");
  //         vm.$broadcast('keyupArrowLeft');
  //         break;
  //       case 39:
  //         console.log("test4");
  //         vm.$broadcast('keyupArrowRight');
  //         break;
  //     }
  //   });
  // }
}
</script>

<style>
#app {
font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
