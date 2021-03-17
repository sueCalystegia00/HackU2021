<template>
  <div class="FireStoreTest">
      <div>Your name is {{user.displayName}}</div>
      <div>{{userCoins}} coins left</div>
  </div>
</template>


<script>
import firebase from "firebase/app";

export default {
  name: "FireStoreTest",
  data() {
    return {
      db: null,
      user: null,
      userCoins: null,
    };
  },
  async created() {
    this.db = firebase.firestore();
    await this.auth();
    await this.getUserCoins();
    await this.createUser();
    console.log(this.userCoins)
    console.log(this.user.uid)
  },
  methods: {
    auth() {
      return new Promise((resolve) => {
        firebase.auth().onAuthStateChanged((user) => {
          if (user) {
            this.user = user;
          } else {
            this.$router.push("/top");
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
  },
};
</script>