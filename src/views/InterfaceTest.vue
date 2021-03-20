<template>
  <div class="Interface">
    <div class="outer">
      <div class="inner">
        <div id="dummyBoxM">{{inputTellNumber}}</div>
        <insertCoin />
        <areatocall @pushnumber="emitEventByPushNumber"/>
      </div>
      <div class="howToUse">ご利用方法</div>
    </div>
  </div>
</template>

<script>
import AreaToCall from "../components/AreaToCall.vue";
import InsertCoin from "../components/InsertCoin.vue";

export default {
  name: "Interface",
  components: {
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
  max-height: 896px;
  min-width: 320px;
  min-height: 568px;
}

.outer {
  width: 100%;
  height: 100%;
  padding: 16px;
  background-color: #7bc046;
  border-radius: 10px;

  display: flex;
  flex-direction: column;
}

.inner {
  width: 100%;
  height: 100%;
  padding: 16px;
  border-radius: 5px;
  box-sizing: border-box; /*これがないとはみ出す*/
  max-height: calc(568px - 32px);
  background-color: #475D52;
}

#dummyBoxM {
  width: 100%;
  height: 100px;
  background-color: #cbb621;
}

#dummyBoxC {
  width: 100%;
  height: 100px;
  background-color: #88878436;
}
</style>