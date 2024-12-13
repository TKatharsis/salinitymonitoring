<template>
  <div id="app">
    <!-- Navbar will appear on all pages -->
    <AppNavbar />
    
    <!-- This is where the routed components will be displayed -->
    <router-view />
    
    <!-- Footer will appear on all pages -->
    <AppFooter />
  </div>
</template>

<script>
import AppNavbar from './components/AppNavbar.vue';
import AppFooter from './components/AppFooter.vue';

export default {
  name: "App",
  components: {
    AppNavbar,
    AppFooter
  }
};
</script>

<style scoped>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  text-align: center;
}
</style>
