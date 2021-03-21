<template>
  <div id="Display">{{ inputTellNumber }}</div>
</template>

<script>
export default {
  name: "AreaToCall",
  props: ['inputTellNumber'],
};
</script>

<style scoped>
#Display {
  width: 100%;
  height: 188.8px;

  background-color: #CBB621;
  border: 3px solid black;
  border-radius: 5px;
  box-sizing: border-box; /*これがないとはみ出す*/
}
</style>
