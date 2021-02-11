<template>
  <div id="main">
    <Top class="top" />
  </div>
</template>

<script>
import Top from '@/components/presenter/Top';

export default {
  components: {
    Top,
  },
}
</script>

<style scoped>
#main {
  height: 100vh;
}

.content {
  min-height: 100vh;
}

</style>