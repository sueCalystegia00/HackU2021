<template>
  <div id="Display">
    <div class="telNUmber">{{ telNUmber(inputTellNumber) }}</div>
  </div>
</template>

<script>
export default {
  name: "AreaToCall",
  props: ["inputTellNumber"],
  methods: {
    telNUmber(number) {
        const one = number.slice(0, 3);
        const two = "-";
        const three = number.slice(3,7);
        const four = "-";
        const five = number.slice(7,11);
        const res = one + two + three + four + five;
      return res;
    },
  },
};
</script>

<style scoped>
#Display {
  width: 100%;
  height: calc(40% - 16px);

  background-color: #cbb621;
  border: 3px solid black;
  border-radius: 5px;
  box-sizing: border-box; /*これがないとはみ出す*/

  display: flex;
  justify-content: center;
  align-items: center;
}

.telNUmber {
  width: 100%;

  font-size: 24px;
  font-weight: 600;

  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
