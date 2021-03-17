<template>
  <div class="Call">
    マイク:
    <select v-model="selectedAudio" @change="onChange">
      <option disabled value="">Please select one</option>
      <option v-for="(audio, key, index) in audios" v-bind:key="index" :value="audio.value">
        {{ audio.text }}
      </option>
    </select>

    カメラ: 
    <select v-model="selectedVideo" @change="onChange">
      <option disabled value="">Please select one</option>
      <option v-for="(video, key, index) in videos" v-bind:key="index" :value="video.value">
        {{ video.text }}
      </option>
    </select>

    <video id="my-video" width="400px" autoplay muted playsinline></video>

    <video id="their-video" width="400px" autoplay playsinline></video>
    <div id="remote-streams"></div>

    <p>Your peer ID is {{ peerID }}</p>

    <input v-model='theirID' placeholder="input ID">
    <p>to PeerID is: {{ theirID }}</p>

    <button v-on:click="makecall">発信(個人)</button>

    <br><br>

    <input v-model='callNumber' placeholder="input Number">
    <p>Call Number is: {{ callNumber }}</p>
    
    接続方式:
    <select v-model="selectedConnectMethod">
      <option v-for="(connectMethod, key, index) in connectMethods" v-bind:key="index">
        {{ connectMethod }}
      </option>
    </select>

    <button v-on:click="joinroom">発信(ルーム)</button>

    <div v-show="this.user.displayName">Your name is {{user.displayName}}</div>
    <div v-show="this.userCoins">{{userCoins}} coins left</div>
    <button @click="signOut">ログアウト</button>

  </div>
</template>

<script>
import firebase from "firebase/app";
import Peer from 'skyway-js';

export default {
  name: 'CallTest',

  data(){
    return{
      audios: [], //取得したオーディオデバイスの情報
      videos: [], //取得したカメラデバイスの情報
      selectedAudio: '', // 使用するオーディオデバイス
      selectedVideo: '', // 使用するカメラデバイス
      peerID: '', // ユーザのpeerID
      theirID: '',  // 相手のpeerID
      callNumber: '', //電話番号(roomID代わり)
      room: null,
      localStream: null,  // 相手に送る自身のビデオ・オーディオ情報
      mediaConnection: null,  // 通話接続情報
      connectMethods: ['sfu', 'mesh'], //接続方式２択
      selectedConnectMethod: 'sfu',  //選択した接続方式(default: sfu)

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

  mounted: async function() {
    // デバイスへのアクセス
    const deviceInfos = await navigator.mediaDevices.enumerateDevices();

    // オーディオデバイスの情報を取得
    deviceInfos
    .filter(deviceInfo => deviceInfo.kind === 'audioinput')
    .map(audio => this.audios.push({text: audio.label || `Microphone ${this.audios.length + 1}`, value: audio.deviceId}));

    // カメラの情報を取得
    deviceInfos
    .filter(deviceInfo => deviceInfo.kind === 'videoinput')
    .map(video => this.videos.push({text: video.label || `Camera  ${this.videos.length - 1}`, value: video.deviceId}));

    // カメラ映像取得
    navigator.mediaDevices.getUserMedia({video: true, audio: true})
    .then( stream => {
      // 成功時にvideo要素にカメラ映像をセットし、再生
      const videoElm = document.getElementById('my-video');
      videoElm.srcObject = stream;
      videoElm.play();
      // 着信時に相手にカメラ映像を返せるように、グローバル変数に保存しておく
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

    // 着信処理
    this.peer.on('call', call => {
      call.answer(this.localStream);
      this.setEventListener(call);
    });

    // 切断イベント
    this.peer.on('close', () => {
      alert('通信が切断しました。');
    });

    // エラーイベント
    this.peer.on('error', err => {
      alert(err.message);
    });

    

  },

  methods: {
    // 発信処理
    makecall(){
      this.mediaConnection = this.peer.call(this.theirID, this.localStream);
      this.setEventListener(this.mediaConnection);
    },

    // ルーム参加
    joinroom(){
      this.room = this.peer.joinRoom(this.callNumber, {
        mode: this.selectedConnectMethod,
        stream: this.localStream,
      });
      this.room.once('open', () => {
        alert('参加しました');
      });

      // ルームに参加した人のストリーム
      this.room.on('stream', async stream => {
        const newVideo = document.createElement('video');
        newVideo.srcObject = stream;
        newVideo.playsInline = true;
        // mark peerId to find it later at peerLeave event
        newVideo.setAttribute('data-peer-id', stream.peerId);
        const remoteVideos = document.getElementById('remote-streams');
        remoteVideos.append(newVideo);
        await newVideo.play().catch(console.error);
      });
    },

    // 接続される際のイベントリスナー
    setEventListener(mediaConnection){
      mediaConnection.on('stream', stream => {
        // video要素にカメラ映像をセットして再生
        const videoElm = document.getElementById('their-video')
        videoElm.srcObject = stream;
        videoElm.play();
      })
    },

    // カメラ・オーディオ選択確認
    onChange(){
      if(this.selectedAudio != '' && this.selectedVideo != ''){
          this.connectLocalCamera();
      }
    },

    // カメラ・オーディオの反映
    async connectLocalCamera(){
      const constraints = {
          audio: this.selectedAudio ? { deviceId: { exact: this.selectedAudio } } : false,
          video: this.selectedVideo ? { deviceId: { exact: this.selectedVideo } } : false
      }

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      document.getElementById('my-video').srcObject = stream;
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
      const videoElm = document.getElementById('my-video');
      let stream = videoElm.srcObject
      let tracks = stream.getTracks();
      tracks.forEach(function(track){
        track.stop();
      });
      firebase.auth().signOut(); //サインアウト
    }
  },
}
</script>
