<template>
  <div id="Display">
    <div class="telNumber">
      <div class="number">{{ telNUmber(inputTelNumber) }}</div>
      <img
        class="deleteIcon"
        src="../assets/バックスペースの削除アイコン.svg"
        @click="deleteNumber"
      />
    </div>
     <transition name="fade">
    <div v-show="existMessage" class="message">{{ message }}</div>
    </transition>
    <div class="wrapper">
      <div class="micSelect">
        <div class="colmun">
          <img class="deleteIcon" src="../assets/マイクのアイコンその10.svg" />
          <div class="label">マイク選択</div>
        </div>
        <select v-model="selectedAudio" @change="onChange">
          <option disabled value="">Please select one</option>
          <option
            v-for="(audio, key, index) in audios"
            v-bind:key="index"
            :value="audio.value"
          >
            {{ audio.text }}
          </option>
        </select>
      </div>
      <div class="column">
        <div class="row">
          <img class="icon" src="../assets/人物のアイコン素材.svg" />
          <div class="count">{{ talkingMembers }}</div>
        </div>
        <div class="label">参加人数</div>
      </div>
      <div class="column">
        <div class="row">
          <img class="icon" src="../assets/砂時計のフリーアイコン.svg" />
          <div class="count">{{ availableTime }}</div>
        </div>
        <div class="label">残り時間</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "AreaToCall",
  props: ["inputTelNumber", "availableTime", "talkingMembers"],

  data() {
    return {
      audios: [], //取得したオーディオデバイスの情報
      selectedAudio: "", // 使用するオーディオデバイス
      message: "",
      existMessage: false
    };
  },

  async mounted() {
    // デバイスへのアクセス
    const deviceInfos = await navigator.mediaDevices.enumerateDevices();

    // オーディオデバイスの情報を取得
    deviceInfos
      .filter((deviceInfo) => deviceInfo.kind === "audioinput")
      .map((audio) =>
        this.audios.push({
          text: audio.label || `Microphone ${this.audios.length + 1}`,
          value: audio.deviceId,
        })
      );

    // ストリーミング生成
    navigator.mediaDevices
      .getUserMedia({ video: false, audio: true })
      .then((stream) => {
        // 着信時に相手に返せるように、グローバル変数に保存しておく
        this.$parent.localStream = stream;
      })
      .catch((error) => {
        // 失敗時にはエラーログを出力
        console.error("mediaDevice.getUserMedia() error:", error);
        return;
      });
  },

  watch: {
    message: {
      handler: function () {
        console.log("hey!");
        setTimeout(()=>{
          this.existMessage = false;
        }, 4000)
      },
    },
  },

  methods: {
    telNUmber(number) {
      const one = number.slice(0, 3);
      const two = "-";
      const three = number.slice(3, 7);
      const four = "-";
      const five = number.slice(7, 11);
      const res = one + two + three + four + five;
      return res;
    },

    messageOnDisplay(message) {
      this.message = message;
      this.existMessage = true;
    },

    // カメラ・オーディオ選択確認
    onChange() {
      if (this.selectedAudio != "") {
        this.connectLocalStream();
      }
    },

    // オーディオの反映
    async connectLocalStream() {
      const constraints = {
        audio: this.selectedAudio
          ? { deviceId: { exact: this.selectedAudio } }
          : false,
        video: false,
      };
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      this.$parent.localStream = stream;
    },

    deleteNumber() {
      this.$emit("deleteNumber");
    }
  },
};
</script>

<style scoped>
.row,
.colmn {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
}

.column {
  flex-direction: column;
}

#Display {
  width: 100%;
  height: calc(40% - 16px);
  padding: 16px;

  background-color: #cbb621;
  border: 3px solid black;
  border-radius: 5px;
  box-sizing: border-box; /*これがないとはみ出す*/

  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
}

.telNumber {
  width: 100%;

  font-size: 24px;
  font-weight: 600;

  display: flex;
  justify-content: space-between;
  align-items: center;
}

.number {
  font-size: 24px;
}

.count {
  font-size: 24px;
  font-weight: 600;
}

.icon,
.deleteIcon {
  width: 30px;
  height: 30px;
}

.deleteIcon {
  margin-left: 16px;
}

.wrapper {
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

.message {
  font-size: 16px;
  font-weight: 600;
  transition: all 300ms 0s ease;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity .2s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}

.micSelect {
  position: relative;
}

select {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  margin: auto;

  max-width: 40px;
  opacity: 0;
}

.label {
  margin-top: 8px;
  font-size: 12px;
  font-weight: 600;
  text-align: center;
}

.availableTime {
  width: 100%;
  font-size: 12px;
  font-weight: 600;
  display: flex;
  justify-content: center;
  align-items: center;
}

svg {
  fill: black;
}
</style>
