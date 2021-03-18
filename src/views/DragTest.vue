<template>
  <div class="Drag">
    <div class="overarea">
        <draggable
        v-model="insertedCoin"
        draggable=".item"
        group="items"
        class="area1"
        >
        </draggable>
    </div>

    <draggable v-model="stockCoins" draggable=".item" group="items">
      <div v-for="item in stockCoins" :key="item.id" class="item">10</div>
    </draggable>
    <div>
      <span>{{ formattedinsertedCoin }}</span>
    </div>
    <div>
      <span>{{ formattedstockCoins }}</span>
    </div>
  </div>
</template>

<script>
import vuedraggable from "vuedraggable";

function dumpObj(obj) {
  return JSON.stringify(obj, null, 2);
}

export default {
  name: "Drag",
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
  methods: {
    showItems() {
      alert(
        this.items.map((val) => {
          return val.id;
        })
      );
    },
  },
};
</script>

<style scoped>
span {
  text-align: start;
  background: #2c3e50;
  color: white;
  padding: 10px;
  font-weight: bold;
}

.item {
  height: 30px;
  width: 30px;
  margin: 10px;
  border-radius: 100px;
  background-color: chocolate;
  display: flex;
  justify-content: space-around;
}

.container {
  margin: auto;
  width: 600px;
  display: flex;
  justify-content: space-around;
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
  height: 100px;
  width: 100px;
  opacity: 0;
}
</style>