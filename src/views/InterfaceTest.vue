<template>
  <div class="Interface">
    <div id="dummyBoxM">メッセージパネル</div>
    <div id="dummyBoxC">コイン投入口</div>
    <areatocall/>
  </div>
</template>

<script>
import AreaToCall from '../components/AreaToCall.vue';

export default {
  name: "Interface",
  components: {
    areatocall: AreaToCall
  }
};
</script>

<style scoped>

.Interface{
  width: 90vw;
  height: 85vh;
  background-color: #475D52;
  border-width: 1px;
  margin: auto;
  overflow: hidden;
}

#dummyBoxM{
  width: 90%;
  height: 30%;
  background-color: #CBB621;
  position: relative;
  margin: 5%;
}

#dummyBoxC{
  width: 90%;
  height: 15%;
  background-color: #88878436;
  position: relative;
  margin: 5%;
}

</style>