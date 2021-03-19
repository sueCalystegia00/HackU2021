<template>
  <div id="InsertCoin">
    <div class="insertCircle">
      <div class="insertBar"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: "InsertCoin",
  data() {
    return {};
  },
};
</script>

<style scoped>
#InsertCoin {
  width: 100%;
  height: 100px;
  background-color: chocolate;
}

.insertCircle {
  width: 90px;
  height: 90px;
  border: solid 3px black;
  border-radius: 100px;
  background-color: #c4c4c4;

  display: flex;
  justify-content: center;
  align-items: center;
}

.insertBar {
  width: 6px;
  height: 60px;
  background-color: black;
}
</style>
