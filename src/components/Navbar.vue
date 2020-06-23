<template>
  <nav class="navbar">
    <div class="container">
      <ul class="navbar-list">
        <li class="navbar-item"><a class="navbar-link" href="#" v-scroll-to="'#top'">HOME</a></li>
        <li class="navbar-item"><a class="navbar-link" href="#" v-scroll-to="'#introduction'">SlideActとは</a></li>
        <li class="navbar-item"><a class="navbar-link" href="#" v-scroll-to="'#how-to-use'">使い方</a></li>
      </ul>
    </div>
  </nav>
</template>

<style scoped>
.navbar {
  display: block;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 6rem;
  background: #fff;
  z-index: 99;
  border-top: 1px solid #eee;
  border-bottom: 1px solid #eee;
}

.navbar-list {
  list-style: none;
  margin-bottom: 0;
  display: inline-block;
}

.navbar-item {
  position: relative;
  float: left;
  margin:0px 5px 0px 5px;
}

.navbar-link {
  font-size: 14px;
  letter-spacing: .2rem;
  margin:0px 10px 0px 10px;
  padding: 15px 0px 15px 0px;
  text-decoration: none;
  line-height: 6.5rem;
  color: #222;
}
</style>