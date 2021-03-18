<template>
  <div class="Drag">
    <draggable v-model="items" draggable=".item">
      <div v-for="item in items" :key="item.id" class="item">
        {{ item.name }}
      </div>
    </draggable>
    <button @click="showItems">表示</button>
  </div>
</template>

<script>
import vuedraggable from "vuedraggable";

export default {
  name: "Drag",
  components: {
    draggable: vuedraggable
  },
  data() {
    return {
      items: [
        {
          id: 1,
          name: "ITEM - 1",
        },
        {
          id: 2,
          name: "ITEM - 2",
        },
        {
          id: 3,
          name: "ITEM - 3",
        },
        {
          id: 4,
          name: "ITEM - 4",
        },
      ],
    };
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
</style>