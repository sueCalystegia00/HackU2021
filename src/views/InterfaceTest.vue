<template>
  <div class="Interface">
    <div class="outer">
      <div class="inner">
        <display :inputTellNumber="inputTellNumber" />
        <insertCoin />
        <areatocall @pushnumber="emitEventByPushNumber" />
      </div>
    </div>
    <div class="howToUse">
        <p class="h1">ご利用方法</p>
        <p class="mt16">1. 電話番号を正しく入力してください</p>
        <p class="mt16">2. 硬化投入口に10円を投入してください</p>
        <p class="mt16">3. 受話器を押下すると通話が始まります</p>
        <p class="mt16">※10円あたり56秒間の通話ができます</p>
        <p class="mt16">※10円を投入すると通話時間が延長されます</p>
      </div>
  </div>
</template>

<script>
import Display from "../components/Display.vue";
import AreaToCall from "../components/AreaToCall.vue";
import InsertCoin from "../components/InsertCoin.vue";

export default {
  name: "Interface",
  components: {
    display: Display,
    areatocall: AreaToCall,
    insertCoin: InsertCoin,
  },
  data() {
    return {
      inputTellNumber: "",
    };
  },
  methods: {
    emitEventByPushNumber(number) {
      this.inputTellNumber += number;
    },
  },
};
</script>

<style scoped>
.Interface {
  width: 100%;
  height: 100%;

  /*最大をiPhoneに設定*/
  max-height: 896px;
  max-width: 414px;
}

.outer {
  width: 100%;
  height: 100%;
  padding: 16px;
  background-color: #7bc046;
  border-radius: 10px 10px 0 0 ;
  box-sizing: border-box; /*これがないとはみ出す*/

  display: flex;
  flex-direction: column;
}

.inner {
  width: 100%;
  height: 100%;
  /*最大をiPhoneに設定*/
  max-height: 812px;

  padding: 16px;
  border-radius: 5px;
  box-sizing: border-box; /*これがないとはみ出す*/
  background-color: #475d52;

  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
}

.howToUse {
  width: 100%;
  padding: 16px;

  color: white;
  background-color: #7bc046;
  border-radius: 0 0 10px 10px;
}

.h1 {
  font-size: 24px;
  font-weight: 600;
}

.mt16 {
  margin-top: 16px;
}
</style>