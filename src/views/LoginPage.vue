<template>
    <div class="login">
      <h2>Login</h2>
      <form @submit.prevent="loginUser">
        <input v-model="username" type="text" placeholder="Username" required />
        <input v-model="password" type="password" placeholder="Password" required />
        <button type="submit">Login</button>
      </form>
      <div v-if="errorMessage" class="error">{{ errorMessage }}</div>
    </div>
  </template>
  
  <script>
  import { ref as dbRef, get } from "firebase/database"; // Removed getDatabase import
import { db } from "../assets/firebaseconfig"; // Assuming db is initialized in firebaseconfig

// The rest of the code remains the same

  
  export default {
    data() {
      return {
        username: "",  // Updated variable to reflect the correct field
        password: "",
        errorMessage: "",
      };
    },
    methods: {
      async loginUser() {
        try {
          const dbRefPath = dbRef(db, "accounts"); // Corrected reference to "accounts"
          const snapshot = await get(dbRefPath);
  
          if (snapshot.exists()) {
            const accounts = snapshot.val(); // Corrected to reference "accounts"
            let userFound = false;
  
            // Check if username and password match any user in the database
            for (let accountId in accounts) {
              if (
                accounts[accountId].username === this.username &&
                accounts[accountId].password === this.password
              ) {
                userFound = true;
                break;
              }
            }
  
            if (userFound) {
              this.$router.push("/dashboard"); // Redirect to dashboard or other page
            } else {
              this.errorMessage = "Invalid username or password.";
            }
          } else {
            this.errorMessage = "No accounts found in the database.";
          }
        } catch (error) {
          this.errorMessage = error.message;
        }
      },
    },
  };
  </script>
  
  <style scoped>
  /* Style for your login page */
  </style>
  