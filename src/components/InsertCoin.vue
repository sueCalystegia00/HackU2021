<template>
  <div id="InsertCoin">
    <div class="outer">
      <div class="insertCircle">
        <div class="insertBar"></div>
        <draggable
          v-model="insertedCoin"
          draggable=".item"
          group="items"
          class="area1"
        >
        </draggable>
      </div>

      <div class="inner">
        <draggable
          v-model="stockCoins"
          draggable=".item"
          group="items"
          class="coinsArea"
        >
          <div v-for="item in stockCoins" :key="item.id" class="item">10</div>
        </draggable>

        <div class="text">◀ 10円を投入</div>
      </div>
    </div>
  </div>
</template>

<script>
import vuedraggable from "vuedraggable";

function dumpObj(obj) {
  return JSON.stringify(obj, null, 2);
}

export default {
  name: "InsertCoin",
  components: {
    draggable: vuedraggable,
  },
  data() {
    return {
      insertedCoin: [],
      stockCoins: [],
    };
  },
  created() {
    const coins = 5;
    for (let i = 0; i < coins; i++) {
      this.stockCoins.push({ id: i, name: `coin${i}` });
    }
  },
  computed: {
    formattedinsertedCoin() {
      return dumpObj(this.insertedCoin);
    },
    formattedstockCoins() {
      return dumpObj(this.stockCoins);
    },
  },
  watch: {
    insertedCoin: {
      handler: function () {
        const musicPath = require("@/assets/register.mp3");
        var audio = new Audio(musicPath); // path to file
        audio.play();
      },
    },
  },
};
</script>

<style scoped>
#InsertCoin {
  width: 100%;
  height: 94.4px;
  margin-top: 16px;
  overflow: hidden;
}

.outer {
  width: 100%;
  height: 100px;
  /*padding: 0 16px;*/
  box-sizing: border-box; /*これがないとはみ出す*/

  display: flex;
  justify-content: space-between;
  align-items: center;
}

.insertCircle {
  min-width: 70px;
  min-height: 70px;
  border: solid 3px black;
  border-radius: 100px;
  background-color: #c4c4c4;

  position: relative;
}

.insertBar {
  width: 6px;
  height: 60px;
  background-color: black;

  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  margin: auto;
}

.inner {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
}

.coinsArea {
  max-width: 250px;

  display: flex;
  justify-content: center;
  align-items: center;
}

.item {
  height: 30px;
  width: 30px;
  margin-left: 8px;
  border: 3px solid black;
  border-radius: 100px;
  background-color: chocolate;
  color: white;
  font-weight: 600;

  display: flex;
  align-items: center;
  justify-content: center;
}

.overarea {
  height: 100px;
  width: 100px;
  background-color: red;
  display: flex;
  justify-content: center;
  align-items: center;
}

.area1 {
  height: 90px;
  width: 90px;
  opacity: 0;

  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  margin: auto;
}

.text {
    font-size: 16px;
    font-weight: 600;
    color: white;

    margin: 8px;
}
</style>
