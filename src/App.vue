<template>
  <div id="app">
    <router-view />
  </div>
</template>

<style>
html,
body,
#app {
  /*font-family: 'Noto Sans JP', sans-serif, 'Avenir', Helvetica, Arial, sans-serif;*/
  height: 100%;
  width: 100%;
  margin: 0;
  padding: 0;
}

#app {
  display: flex;
  justify-content: center;
  align-items: center;
}

a,
p,
button {
  margin: 0;
  padding: 0;
}
</style>