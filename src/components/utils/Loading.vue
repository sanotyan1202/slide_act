<template>
  <vue-loading type="spiningDubbles" color="#aaa"
        :size="{ width: '50px', height: '50px' }"></vue-loading>
</template>

<script>
import { VueLoading } from 'vue-loading-template'

export default {
  components: {
    VueLoading,
  },
}
</script>