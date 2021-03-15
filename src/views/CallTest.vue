<template>
  <div class="Call">
    <video id="my-video" width="400px" autoplay muted playsinline></video>
    <p>Your peer ID is {{ peerID }}</p>
    <input v-model='theirID' placeholder="input ID">
    <p>Message is: {{ theirID }}</p>

    <button v-on:click="makecall">発信</button>
    <video id="their-video" width="400px" autoplay muted playsinline></video>

    
  </div>
</template>

<script>

import Peer from 'skyway-js';

export default {
  name: 'CallTest',

  data(){
    return{
      peerID: '',
      theirID: '',
      localStream: null,
      mediaConnection: null,
    }
  },

  mounted() {
    // 通信拠点の単位となるオブジェクトのインスタンスを生成
    this.peer = new Peer(this.name,{
      key: process.env.VUE_APP_SKYWAY_KEY,  // APIkey
      debug: 3  // ログの出力レベル．3の場合は開発用に全てのログを出力する．
    })

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

    //PeerID取得
    this.peer.on('open', () => {
      this.peerID = this.peer.id;
    });

    // 着信処理
    this.peer.on('call', (call) => {
      this.mediaConnection = call;
      this.mediaConnection.answer(this.localStream);
      setEventListener(this.mediaConnection);
    })

  },

  // 発信処理
  methods: {
    makecall(){
      this.mediaConnection = this.peer.call(this.theirID, this.localStream);
      this.setEventListener(this.mediaConnection);
    },

    setEventListener(mediaConnection){
      mediaConnection.on('stream', stream => {
        // video要素にカメラ映像をセットして再生
        const videoElm = document.getElementById('their-video')
        videoElm.srcObject = stream;
        videoElm.play();
      })
    }

    
  }
}
</script>
