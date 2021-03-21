<template>
  <div id="AreaToCall">
    <div id="receiver" @click="callByEmit">
      <img class="callicon" src="@/assets/icon_calling.svg" />
    </div>
    <div id="keynumbers">
      <button
        v-for="key in keynumbers"
        :key="key.id"
        class="keynumber"
        @click="inputTelNumberByEmit(key)"
      >
        {{ key }}
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: "AreaToCall",
  data() {
    return {
      keynumbers: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "＊", "0", "♯"],
    };
  },
  methods: {
    callByEmit() {
      console.log("発信");
      this.$emit("pushcall", );
    },
    playSound(key) {
      let musicPath;
      if (key % 2 == 0) {
        musicPath = require("@/assets/Telephone-DTMF01-01(1).mp3");
      } else if (key % 3 == 0) {
        musicPath = require("@/assets/Telephone-DTMF01-02(2).mp3");
      } else {
        musicPath = require("@/assets/Telephone-DTMF01-03(3).mp3");
      }
      var audio = new Audio(musicPath); // path to file
      audio.play();
    },
    inputTelNumberByEmit(key) {
      console.log("input is " + key);
      this.$emit("pushnumber", key);
      this.playSound(key);
    },
  },
};
</script>

<style scoped>
#AreaToCall {
  width: 100%;
  height: calc(40% - 16px);

  display: flex;
  justify-content: space-between;
}

#receiver {
  width: 20%;
  background-color: #7bc046;
  border: 3px solid black;
  border-radius: 20px;

  display: flex;
  justify-content: center;
  align-items: center;
}

.callicon {
  width: 50%;
}

#keynumbers {
  width: 65%;
  height: 100%;

  display: grid;
  grid-template-rows: 25% 25% 25% 25%;
  grid-template-columns: 33% 33% 33%;

  gap: 1px;
}

.keynumber {
  height: calc(100% - 2px);
  width: calc(100% - 2px);

  border: 0px;
  border-radius: 50%;
  background-color: #000000;
  font-weight: bold;
  font-size: 24px;
  color: #cbb621;

  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
