<template>
  <div class="Top">
    <button @click="signUp">Googleアカウントでログイン</button>
  </div>
</template>


<script>
import firebase from "firebase/app";

export default {
  name: "Top",
  data() {
    return {
      userName: 'hello'
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