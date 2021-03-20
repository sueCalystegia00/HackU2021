<template>
  <div id="AreaToCall">
    <button id="receiver">
      <img class="callicon" src="@/assets/icon_calling.svg"/>
    </button>
    <div id="keynumbers">
      <button
        v-for="key in keynumbers" :key="key.id"
        class="keynumber"
        @click="inputTelNumberByEmit(key)"
      >
        {{key}}
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AreaToCall',
  data() {
    return {
      keynumbers: ['1','2','3','4','5','6','7','8','9','＊','0','♯'],
    };
  },
  methods: {
    inputTelNumberByEmit(key) {
      console.log("input is " + key);
      this.$emit('pushnumber', (key));
    }
  }
}
</script>

<style scoped>

#AreaToCall{
  width: 90%;
  height: 45%;
  position: relative;
  margin: 5%;
  display: flex;
}

#receiver{
  width: 25%;
  height: 100%;
  background-color: #7BC046;
  border-width: 3px;
  border-radius: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.callicon{
  width: 70%;
}

#keynumbers{
  width: 75%;
  height: 100%;
  display: grid;
  grid-template-columns: 33% 33% 33%;
  margin-left: 5%;
}

.keynumber{
  width: 90%;
  height: 90%;
  margin: auto;
  border: 0px;
  border-radius: 50%;
  background-color: #000000;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: bold;
  color: #CBB621;
}


</style>
