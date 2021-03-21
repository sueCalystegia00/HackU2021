<template>
  <div id="AreaToCall">
    <button id="receiver" @click="call">
      <img class="callicon" src="@/assets/icon_calling.svg" />
    </button>
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
    call() {
      console.log("発信");
    },
    playSound(key) {
      let musicPath;
      if(key % 2 == 0) {
        musicPath = require("@/assets/Telephone-DTMF01-01(1).mp3");
      } else if(key % 3 == 0) {
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
  width: 90%;
  height: 45%;
  position: relative;
  margin: 5%;
  display: flex;
}

#receiver {
  width: 25%;
  height: 100%;
  background-color: #7bc046;
  border-width: 3px;
  border-radius: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.callicon {
  width: 70%;
}

#keynumbers {
  width: 75%;
  height: 100%;
  display: grid;
  grid-template-columns: 33% 33% 33%;
  margin-left: 5%;
}

.keynumber {
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
  color: #cbb621;
}
</style>
