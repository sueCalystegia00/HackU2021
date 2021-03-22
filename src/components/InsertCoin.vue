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
    // createStockCoins(dbCoins)に移動
    /* const coins = 5;
    for (let i = 0; i < coins; i++) {
      this.stockCoins.push({ id: i, name: `coin${i}` });
    } */
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
        this.$emit("insertcoin", );
      },
    },
  },
  methods: {
    createStockCoins(dbCoins){  // Callから発火，コインを生成する
      for (let i = 0; i < dbCoins; i++) {
        this.stockCoins.push({ id: i, name: `coin${i}` });
      }
    }
  }
};
</script>

<style scoped>
#InsertCoin {
  width: 100%;
  height: calc(20% - 16px);
  overflow: hidden;
}

.outer {
  width: 100%;
  height: 100%;
  /*padding: 0 16px;*/
  box-sizing: border-box; /*これがないとはみ出す*/

  display: flex;
  justify-content: space-between;
  align-items: center;
}

.insertCircle {
  min-width: 60px;
  min-height: 60px;
  max-height: 100px;
  max-width: 100px;

  border: solid 3px black;
  border-radius: 100px;
  background-color: #c4c4c4;

  position: relative;
}

.area1 {
  width: 30%;
  min-width: 60px;
  min-height: 60px;
  max-height: 100px;
  max-width: 100px;

  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  margin: auto;

  opacity: 0;
}

.area1:before {
  content: "";
  display: block;
  padding-top: 100%;
}

.insertBar {
  width: 6px;
  height: 80%;
  background-color: black;

  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  margin: auto;
}

.inner {
  width: 80%;
  
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

.coinsArea {
  width: 100%;
  
  display: flex;
  justify-content: center;
  align-items: center;

  overflow: hidden;
}

.item {
  box-sizing: border-box; /*これがないとはみ出す*/
  min-height: 30px;
  min-width: 30px;
  margin-left: 8px;
  border: 3px solid black;
  border-radius: 100px;
  background-color: chocolate;
  color: white;
  font-weight: 600;
  font-size: 12px;

  display: flex;
  align-items: center;
  justify-content: center;
}

.text {
  font-size: 16px;
  font-weight: 600;
  color: white;

  margin: 8px;
}
</style>
