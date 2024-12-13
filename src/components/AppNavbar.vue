<template>
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark px-4">
      <a class="navbar-brand" href="#">Admin Dashboard</a>
  
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
  
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav me-auto">
          <!-- Use router-link for Home -->
          <li class="nav-item">
            <router-link to="/home" class="nav-link">Home</router-link>
          </li>
          <li class="nav-item">
            <router-link to="/sensors" class="nav-link">Sensors</router-link>
          </li>
        </ul>
  
        <div class="d-flex align-items-center">
          <button
            class="btn btn-outline-light"
            type="button"
          >
            <i class="bi bi-person-circle me-1"></i> John Doe
          </button>
        </div>
  
        <div class="d-flex align-items-center">
          <button
            class="btn btn-outline-light ms-2"
            @click="logout"
          >
            <i class="bi bi-box-arrow-right me-1"></i> Logout
          </button>
        </div>
      </div>
    </nav>
  </template>
  
  <script>
  export default {
    name: "AppNavbar",
    methods: {
      logout() {
        this.$router.push("/"); // Redirect to the login page
      },
    },
  };
  </script>
  
  <style scoped>
  /* Adjust navbar styling for King Crimson theme */
  .bg-dark {
    background-color: #2C2C2C !important;
  }
  
  .nav-link {
    color: #DC143C !important;
  }
  
  .nav-link.active {
    color: #A52A2A !important;
  }
  
  .nav-link:hover {
    color: #A52A2A !important;
  }
  
  .btn-outline-light {
    color: #DC143C;
    border-color: #DC143C;
  }
  
  .btn-outline-light:hover {
    background-color: #DC143C;
    color: white;
  }
  </style>
  