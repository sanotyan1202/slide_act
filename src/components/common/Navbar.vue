<template>
  <nav class="navbar">
    <div class="container">
      <div :class="{left: parent==='top'}">
        <a class="logo-container" href="/">
          <img class="logo" src="img/logo.png" alt="logo">
        </a>
      </div>
    </div>
  </nav>
</template>

<script>
export default {
    props: ['parent'],
}
</script>

<style scoped>

.logo {
  width:10rem;
  margin-top:0.8rem;
}

.navbar {
  display: block;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 3.5rem;
  background: #fff;
  z-index: 99;
  border-top: 1px solid #eee;
  border-bottom: 1px solid #eee;
}

.left {
  text-align:left;
}

.navbar-list {
  list-style: none;
  margin: 0;
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
  line-height: 3rem;
  color: #222;
}
</style>