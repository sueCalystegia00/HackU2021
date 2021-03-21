<template>
  <div class="Call">
    <p>Your peer ID is {{ peerID }}</p>

    マイク:
    <select v-model="selectedAudio" @change="onChange">
      <option disabled value="">Please select one</option>
      <option v-for="(audio, key, index) in audios" v-bind:key="index" :value="audio.value">
        {{ audio.text }}
      </option>
    </select>

    <div id="remote-streams"></div>

    <input v-model='callNumber' placeholder="input Number">
    <p>Call Number is: {{ callNumber }}</p>
    
    接続方式:
    <select v-model="selectedConnectMethod">
      <option v-for="(connectMethod, key, index) in connectMethods" v-bind:key="index">
        {{ connectMethod }}
      </option>
    </select>

    <button @click="addTime">10円投下ボタン(仮)</button>

    <button @click="joinroom">発信(ルーム)</button>
    <button @click="leaveroom">退出(ルーム)</button>

    <div v-show="this.user.displayName">Your name is {{user.displayName}}</div>
    <div v-show="this.userCoins">{{userCoins}} coins left</div>
    <button @click="signOut">ログアウト</button>

  </div>
</template>

<script>
import firebase from "firebase/app";
import Peer from 'skyway-js';

export default {
  name: 'Call',

  data(){
    return{
      audios: [], //取得したオーディオデバイスの情報
      selectedAudio: '', // 使用するオーディオデバイス
      peerID: '', // ユーザのpeerID
      callNumber: '', //電話番号(roomID代わり)
      room: null,
      localStream: null,  // 相手に送る自身のビデオ・オーディオ情報
      connectMethods: ['sfu', 'mesh'], //接続方式２択
      selectedConnectMethod: 'sfu',  //選択した接続方式(default: sfu)
      countdowntimer: null,
      availabletime: 0, // 通話可能時間

      db: null, // FireSote接続用
      user: null, // userの名前やIDを格納
      userCoins: null, // ユーザのコイン残り枚数
    }
  },

  async created() {
    this.db = firebase.firestore();
    await this.auth();
    await this.getUserCoins();
    await this.createUser();
    console.log(this.userCoins)
    console.log(this.user.uid)
  },

  async mounted() {
    // デバイスへのアクセス
    const deviceInfos = await navigator.mediaDevices.enumerateDevices();

    // オーディオデバイスの情報を取得
    deviceInfos
    .filter(deviceInfo => deviceInfo.kind === 'audioinput')
    .map(audio => this.audios.push({text: audio.label || `Microphone ${this.audios.length + 1}`, value: audio.deviceId}));

    // ストリーミング取得
    navigator.mediaDevices.getUserMedia({video: false, audio: true})
    .then( stream => {
      // 着信時に相手に返せるように、グローバル変数に保存しておく
      this.localStream = stream;
    }).catch( error => {
      // 失敗時にはエラーログを出力
      console.error('mediaDevice.getUserMedia() error:', error);
      return;
    });


    // 通信拠点の単位となるオブジェクトのインスタンスを生成
    this.peer = new Peer(this.name,{
      key: process.env.VUE_APP_SKYWAY_KEY,  // APIkey
      debug: 3  // ログの出力レベル．3の場合は開発用に全てのログを出力する．
    })

    //PeerID取得
    this.peer.on('open', () => {
      this.peerID = this.peer.id;
    });

  },

  watch: {
    availabletime: {
      immediate: true,
      handler: function () {
        console.log("残り " + this.availabletime + "秒");
        if(this.availabletime == 0 && this.room != null){
          this.leaveroom();
        }
      },
    }
  },

  methods: {
    addTime(){
      this.availabletime += 5;
    },

    // ルーム参加
    joinroom(){
      if(this.availabletime <= 0){
        console.log("金入れてください");
        return;
      };
      if(this.callNumber.length < 11){
        console.log("11桁の番号を入れてください");
        return;
      }
      // ルームの確立
      this.room = this.peer.joinRoom(this.callNumber, {
        mode: this.selectedConnectMethod,
        stream: this.localStream,
      });
      
      // 参加
      this.room.once('open', () => {
        this.countdowntimer = setInterval(this.availabletime--,1000); //1000ミリ秒間隔で通話可能時間を減らす
        alert('参加しました');
      });

      // ルームに他の新規参加があった場合
      this.room.on('stream', async stream => {
        const newAudio = document.createElement('audio');
        newAudio.srcObject = stream;
        newAudio.playsInline = true;

        newAudio.setAttribute('data-peer-id', stream.peerId);
        const remoteAudios = document.getElementById('remote-streams');
        remoteAudios.append(newAudio);
        await newAudio.play().catch(console.error);
        alert(stream.peerId + "さんが参加しました");
      });

      // ルームから参加者が退出する場合の処理
      this.room.on('peerLeave', peerId => {
        const remoteAudios = document.getElementById('remote-streams');
        const remoteAudio= remoteAudios.querySelector(
          `[data-peer-id="${peerId}"]`
        );
        remoteAudio.srcObject.getTracks().forEach(track => track.stop());
        remoteAudio.srcObject = null;
        remoteAudio.remove();

        alert(peerId + "さんが退出しました");
      });
    },

    // ルーム退出
    leaveroom(){
      this.room.close(), { once: true };
      this.callNumber = '';
      this.room = null;
      this.removeAudioChildren();
      clearInterval(this.countdowntimer);
      this.availabletime = 0;
      alert("roomから退出しました");
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
      this.localStream = stream;
    },

    auth() {
      return new Promise((resolve) => {
        firebase.auth().onAuthStateChanged((user) => {
          if (user) {
            this.user = user;
          } else {
            this.$router.push("/");
          }
          resolve();
        });
      });
    },

    async getUserCoins() {
      const uid = this.user.uid;
      const q = await this.db.collection("users").doc(uid).get();
      if (q.data()) {
        this.userCoins = q.data().coins;
      }
    },

    async createUser() {
      if (this.userCoins) {
        return;
      }
      await this.db.collection("users").doc(this.user.uid).set({'coins': 5});
      this.userCoins = 5;
    },

    signOut() {
      this.leaveroom();
      const audioElm = document.getElementById('my-audio');
      let stream = audioElm.srcObject;
      let tracks = stream.getTracks();
      tracks.forEach(function(track){
        track.stop();
      });
      firebase.auth().signOut(); //サインアウト
    },

    // 参加者のAudioタグを消す
    removeAudioChildren(){
      const remoteAudios = document.getElementById('remote-streams');
      Array.from(remoteAudios.children).forEach(remoteAudio => {
        remoteAudio.srcObject.getTracks().forEach(track => track.stop());
        remoteAudio.srcObject = null;
        remoteAudio.remove();
      });
    }
  },
}
</script>
