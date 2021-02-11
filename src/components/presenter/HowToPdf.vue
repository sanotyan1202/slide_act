<template>
<div>
  <ul class="to-pdf-menu">
    <li @click="current = 'PowerPoint'"
        @mouseover="hover = 'PowerPoint'" 
        @mouseleave="hover = ''">
        <img v-if="powerPoint || hoverPowerPoint" class="selected" src="img/favicon.png" alt="selected">
        PowerPoint
    </li>
    <li @click="current = 'GoogleSlide'"
        @mouseover="hover = 'GoogleSlide'" 
        @mouseleave="hover = ''">
        <img v-if="googleSlide || hoverGoogleSlide" class="selected" src="img/favicon.png" alt="selected">
        GoogleSlide
    </li>
    <li @click="current = 'beautiful.ai'"
        @mouseover="hover = 'beautiful.ai'" 
        @mouseleave="hover = ''">
        <img v-if="beautifulAi || hoverBeautifulAi" class="selected" src="img/favicon.png" alt="selected">
        beautiful.ai
    </li>
  </ul>
  <div v-if="!none" class="to-pdf-body">
    <img v-if="powerPoint" class="to-pdf-image" src="img/pptx2pdf.png" />
    <img v-if="googleSlide" class="to-pdf-image" src="img/gs2pdf.png" />
    <img v-if="beautifulAi" class="to-pdf-image" src="img/bai2pdf.png" />
  </div>
</div>
</template>

<script>
export default {
  data: function() {
    return {
      current: '',
      hover: '',
    }
  },

  computed: {
    none: function() { return this.current === ''; },
    powerPoint: function() { return this.current === 'PowerPoint'; },
    googleSlide: function() { return this.current === 'GoogleSlide'; },
    beautifulAi: function() { return this.current === 'beautiful.ai'; },
    hoverPowerPoint: function() { return this.hover === 'PowerPoint'; },
    hoverGoogleSlide: function() { return this.hover === 'GoogleSlide'; },
    hoverBeautifulAi: function() { return this.hover === 'beautiful.ai'; },
  }
}
</script>

<style scoped>
ul.to-pdf-menu {
  display: flex;
  justify-content: center;
  list-style: none;
  margin-top: 0;
  margin:0 auto;
}

.to-pdf-menu li {
  padding: 0.5rem 2.9rem 0.5rem 0;
  width: 8rem;
  text-align: right;
  color: #2b3e50;
  border-style: solid;
  border-width: 1px;
  margin-left: -1px;
  border-color: #eaedf1;
}

.selected {
  width: 0.8rem;
  margin-right: 0.2rem;
}

.to-pdf-menu li:hover {
  cursor: pointer;
}

.to-pdf-menu li:not(.active):hover {
  background-color: white;
}

.to-pdf-body {
  border: solid 0.5px #eaedf1;
  height: 28rem;
  width: 60rem;
  padding: 1rem;
  left: 0;
  right: 0;
  margin: auto;
  margin-top: 1rem;
}

.to-pdf-image {
  width: 100%;
  object-fit: cover;
}
</style>