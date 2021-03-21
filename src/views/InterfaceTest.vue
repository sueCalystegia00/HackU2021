<template>
  <div class="Interface">
    <div class="outer">
      <div class="inner">
        <display :inputTellNumber="inputTellNumber" />
        <insertCoin />
        <areatocall @pushnumber="emitEventByPushNumber"/>
      </div>
      <div class="howToUse">
        <p>ご利用方法</p>
        <p>ご利用方法</p>
        <p>ご利用方法</p>
        <p>ご利用方法</p>
        <p>ご利用方法</p>
        </div>
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
    insertCoin: InsertCoin
  },
  data() {
    return {
      inputTellNumber: '',
    };
  },
  methods:{
    emitEventByPushNumber(number){
      this.inputTellNumber += number;
    }
  }
};
</script>

<style scoped>
.Interface {
  width: 100%;
  height: 100%;
  /*最大・最小幅をiPhoneに設定*/
  max-width: 414px;
  min-width: 320px;
  min-height: 568px;
}

.outer {
  width: 100%;
  padding: 16px;
  background-color: #7bc046;
  border-radius: 10px;
  box-sizing: border-box; /*これがないとはみ出す*/

  display: flex;
  flex-direction: column;
}

.inner {
  width: 100%;
  padding: 16px;
  border-radius: 5px;
  box-sizing: border-box; /*これがないとはみ出す*/
  background-color: #475D52;
}
</style>