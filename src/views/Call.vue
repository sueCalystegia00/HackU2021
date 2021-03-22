<template>
  <div class="Call">
    <div class="outer">
      <div class="inner">
        <display
          :availableTime="availabletime"
          :inputTelNumber="inputTelNumber"
        />
        <insertCoin 
          ref="component_insertCoin"
          @insertcoin="emitEventByInsertCoin" 
        />
        <areatocall 
          @pushnumber="emitEventByPushNumber"
          @pushcall="emitEventByPushCall"
        />
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





    

    <div id="remote-streams"></div>

    <button @click="leaveroom">退出(ルーム)</button>
    <button @click="signOut">ログアウト</button>

  </div>
</template>

<script>
import firebase from "firebase/app";
import Peer from 'skyway-js';
import Display from "../components/Display.vue";
import AreaToCall from "../components/AreaToCall.vue";
import InsertCoin from "../components/InsertCoin.vue";

export default {
  name: 'Call',

  components: {
    display: Display,
    areatocall: AreaToCall,
    insertCoin: InsertCoin,
  },

  data(){
    return{
      //audios: [], //取得したオーディオデバイスの情報
      //selectedAudio: '', // 使用するオーディオデバイス
      peerID: '', // ユーザのpeerID
      inputTelNumber: '', //電話番号(roomID代わり)
      room: null, //参加中のルーム
      localStream: null,  // 相手に送る自身のビデオ・オーディオ情報
      selectedConnectMethod: 'sfu',  //接続方式(default: sfu, meshでも可能)
      countdowntimer: '', //カウントダウン用のタイマー
      availabletime: 0, // 通話可能時間
      talkingmembers: 0,  // 参加人数
      holdaudio: null,

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
    /* // デバイスへのアクセス
    const deviceInfos = await navigator.mediaDevices.enumerateDevices();

    // オーディオデバイスの情報を取得
    deviceInfos
    .filter(deviceInfo => deviceInfo.kind === 'audioinput')
    .map(audio => this.audios.push({text: audio.label || `Microphone ${this.audios.length + 1}`, value: audio.deviceId}));

    // ストリーミング生成
    navigator.mediaDevices.getUserMedia({video: false, audio: true})
    .then( stream => {
      // 着信時に相手に返せるように、グローバル変数に保存しておく
      this.localStream = stream;
    }).catch( error => {
      // 失敗時にはエラーログを出力
      console.error('mediaDevice.getUserMedia() error:', error);
      return;
    }); */

    // 通信拠点の単位となるオブジェクトのインスタンスを生成
    this.peer = new Peer(this.name,{
      key: process.env.VUE_APP_SKYWAY_KEY,  // APIkey
      debug: 3  // ログの出力レベル．3の場合は開発用に全てのログを出力する．
    })

    //自身のPeerID取得
    this.peer.on('open', () => {
      this.peerID = this.peer.id;
      console.log("My PeerID is " + this.peerID);
    });

    // 保留音の設定
    this.holdaudio = new Audio(require("@/assets/Telephone-Music_On_Hold01-1(Salut_dAmour).mp3")); // path to file
    this.holdaudio.loop = true;
  },
  
  beforeDestroy () {
    clearInterval(this.countdowntimer);
  },

  watch: {
    availabletime: {
      immediate: true,
      handler: function () {
        console.log("残り " + this.availabletime + "秒");
        // ルーム接続中に時間が0になったら退出処理
        if(this.availabletime == 0 && this.room != null){
          this.leaveroom();
        }
      },
    },
    talkingmembers: {
      handler: function(){
        if(this.talkingmembers == 1){
          this.holdaudio.play();  //保留音を再生
          clearInterval(this.countdowntimer);
        }else if(this.talkingmembers > 1){
          this.holdaudio.pause(); //保留音を停止
          // ルーム参加後から通話可能時間を減らしていく
          this.countdowntimer = setInterval(
            function(){
              this.availabletime--;
            }.bind(this),
            1000  //1000ミリ秒間隔で通話可能時間を減らす
          ); 
        }
      }
    }
  },

  methods: {
    // 10円投下による時間延長
    emitEventByInsertCoin(){
      this.availabletime += 10; //テスト用に10秒追加
      this.userCoins--; // 所持コインを減らす
      this.setUserCoins(this.userCoins);  // db更新
    },

    emitEventByPushNumber(number) {
      this.inputTelNumber += number;
    },

    // ルーム参加
    emitEventByPushCall(){
      if(this.availabletime <= 0){
        console.log("お金を入れてください");
        return;
      };
      if(this.inputTelNumber.length < 11){
        console.log("11桁の番号を入れてください");
        return;
      }

      // ルームの確立
      this.room = this.peer.joinRoom(this.inputTelNumber, {
        mode: this.selectedConnectMethod,
        stream: this.localStream,
      });
      console.log("joined room name is " + this.room.name);

      /* // 5秒だけコール音を再生(したかった)
      const musicPath = require("@/assets/Telephone-Signal_Tone02-1(Ringback).mp3");
      var ringaudio = new Audio(musicPath); // path to file
      ringaudio.play();
      setTimeout(
        function(){
          ringaudio.pause();
        },
        5000
      ); */

      // 参加
      this.room.once('open', () => {
        this.talkingmembers++;  // 自分も一人としてカウント
        console.log("参加しました");
      });

      // ルームに他の新規参加があった場合
      this.room.on('stream', async stream => {
        this.talkingmembers++;
        // 取得したストリームを再生する要素の生成
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
        this.talkingmembers--;
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
      if(this.room == null)return;  // 参加していない場合は何もしない
      this.room.close(), { once: true };  // ルームを退出
      this.holdaudio.pause(); //保留音を停止
      this.talkingmembers = 0;
      this.inputTelNumber = '';
      this.room = null;
      this.removeAudioChildren();
      clearInterval(this.countdowntimer);
      this.availabletime = 0;
      alert("roomから退出しました");
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
      this.$refs.component_insertCoin.createStockCoins(this.userCoins); // InsertCoinコンポーネントにコインを生成させる
    },

    // dbのコイン枚数更新
    async setUserCoins(setcoins) {
      const uid = this.user.uid;
      const uRef = await this.db.collection("users").doc(uid);
      uRef.update({coins: setcoins});
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
      let tracks = this.localStream.getTracks();
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

<style scoped>
.Call {
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
  box-sizing: border-box; /*これがないとはみ出す*/

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