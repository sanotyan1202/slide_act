<template>
  <div id="main">
    <div class="navbar-container">
      <Navbar />
    </div>
    <div class="top-container content">
      <Top class="top" />
    </div>
    <div class="introduction-container content">
      <Introduction class="introduction" />
    </div>
    <div class="how-to-use-container content">
      <HowToUse class="how-to-use" />
    </div>
  </div>
</template>

<script>
import Navbar from '@/components/Navbar';
import Top from '@/components/Top';
import Introduction from '@/components/Introduction';
import HowToUse from '@/components/HowToUse';

export default {
  components: {
    Navbar,
    Top,
    Introduction,
    HowToUse,
  },
}
</script>

<style scoped>
#main {
  /* scroll-snap-type: y mandatory; */
  height: 100vh;
  /* overflow-y: scroll; */
}

.content {
  /* scroll-snap-align: start; */
  min-height: 100vh;
}

</style>