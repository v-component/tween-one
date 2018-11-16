<template>
  <div id="app">
    <div class="demo">
      <router-view/>
    </div>
  </div>
</template>

<style lang="scss">
  @import './assets/styles/index.scss';
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #2c3e50;
  }
  .demo {
    padding-top: 100px;
    width: 80%;
    margin: 0 auto;
    max-width: 1000px;
  }

</style>
