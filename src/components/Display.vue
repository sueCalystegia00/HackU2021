<template>
  <div id="Display">
    <div class="telNumber">{{ telNUmber(inputTelNumber) }}</div>
    <div class="availableTime">残り{{ availableTime }}秒</div>
    <div class="talkingMembers">{{ talkingMembers }}人接続中...</div>

    マイク:
    <select v-model="selectedAudio" @change="onChange">
      <option disabled value="">Please select one</option>
      <option v-for="(audio, key, index) in audios" v-bind:key="index" :value="audio.value">
        {{ audio.text }}
      </option>
    </select>
  </div>
</template>

<script>
export default {
  name: "AreaToCall",
  props: [
    "inputTelNumber",
    "availableTime",
    "talkingMembers"
  ],

  data(){
    return{
      audios: [], //取得したオーディオデバイスの情報
      selectedAudio: '', // 使用するオーディオデバイス
    }
  },

  async mounted(){
    // デバイスへのアクセス
    const deviceInfos = await navigator.mediaDevices.enumerateDevices();

    // オーディオデバイスの情報を取得
    deviceInfos
    .filter(deviceInfo => deviceInfo.kind === 'audioinput')
    .map(audio => this.audios.push({text: audio.label || `Microphone ${this.audios.length + 1}`, value: audio.deviceId}));

    // ストリーミング生成
    navigator.mediaDevices.getUserMedia({video: false, audio: true})
    .then( stream => {
      // 着信時に相手に返せるように、グローバル変数に保存しておく
      this.$parent.localStream = stream;
    }).catch( error => {
      // 失敗時にはエラーログを出力
      console.error('mediaDevice.getUserMedia() error:', error);
      return;
    });
  },

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

    messageOnDisplay(message){
      const instanceMessage = "message on display is " + message;
      return instanceMessage;
    },

    // カメラ・オーディオ選択確認
    onChange(){
      if(this.selectedAudio != ''){
        this.connectLocalStream();
      }
    },

    // オーディオの反映
    async connectLocalStream(){
      const constraints = {
        audio: this.selectedAudio ? { deviceId: { exact: this.selectedAudio } } : false,
        video: false
      }
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      this.$parent.localStream = stream;
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
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.telNumber {
  width: 100%;

  font-size: 24px;
  font-weight: 600;

  display: flex;
  justify-content: center;
  align-items: center;
}

.availableTime {
  width: 100%;
  font-size: 12px;
  font-weight: 600;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
