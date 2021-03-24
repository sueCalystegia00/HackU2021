<template>
  <div class="Top">
    <div class="title">P(ay) Phone</div>
    <button class="googleButton" @click="signUp">Googleアカウントではじめる</button>
  </div>
</template>

<script>
import firebase from "firebase/app";

export default {
  name: "Top",
  data() {
    return {
      userName: "hello",
    };
  },
  methods: {
    signUp() {
      var provider = new firebase.auth.GoogleAuthProvider();
      firebase
        .auth()
        .signInWithPopup(provider)
        .then((obj) => {
          alert("Create account: " + obj.user.displayName);
          this.$router.push("/call");
        })
        .catch((error) => alert(error.message));
    },
  },
};
</script>

<style scoped>
.Top {
  width: 100%;
  height: 100%;

  padding: 32px;
  box-sizing: border-box; /*これがないとはみ出す*/

  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;

  position: relative;

  background-image: url("../assets/paytel.jpg");
   background-size: cover;
   background-position: center;
}

.title {
  font-size: 36px;
  font-weight: 600;

  color: white;

  margin-bottom: 64px;

}

.googleButton {
  height: 56px;
  width: calc(100% - 64px);

  color: #d64242e7;
  border: 3px solid #d64242e7;
  border-radius: 100px;
  background-color: white;

  position: absolute;
  bottom: 64px;
}
</style>