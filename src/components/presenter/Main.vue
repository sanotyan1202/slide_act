<template>
  <div id="main">
    <div class="navbar-container">
      <Navbar />
    </div>
    <div class="top-container content">
      <Top class="top" />
    </div>
  </div>
</template>

<script>
import Navbar from '@/components/presenter/Navbar';
import Top from '@/components/presenter/Top';

export default {
  components: {
    Navbar,
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