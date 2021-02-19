<template>
  <div id="app">
     <router-view />
  </div>
</template>

<script>
export default {
  name: 'App',
}
</script>

<style>
#app {
  font-family: YakuHanJP, "Noto Sans JP", "Helvetica Neue", Arial, "Hiragino Kaku Gothic ProN", "Hiragino Sans", Meiryo, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2b3e50;
}

.container {
  padding: 0 10% 0 10%;
}

main.content {
  margin-top: 5rem;
}

input {
  font-size: 16px;
}
</style>
