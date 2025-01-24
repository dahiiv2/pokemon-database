<script setup>
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <div class="app-container">
    <nav class="main-nav">
      <RouterLink to="/" class="nav-link">Home</RouterLink>
      <RouterLink to="/about" class="nav-link">About</RouterLink>
      <RouterLink to="/pokemons" class="nav-link">Pokemons</RouterLink>
    </nav>

    <RouterView />
  </div>
</template>

<style>
/* Reset default styles */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body {
  margin: 0;
  padding: 0;
  width: 100%;
  min-height: 100vh;
  background-color: #f0f2f5;
  color: #333;
  line-height: 1.6;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

#app {
  width: 100%;
  min-height: 100vh;
}

.app-container {
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #f0f2f5;
}

.main-nav {
  background-color: #2196F3;
  padding: 1rem;
  display: flex;
  justify-content: center;
  gap: 2rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.nav-link {
  color: white;
  text-decoration: none;
  font-weight: 500;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  transition: background-color 0.2s;
  font-size: 1.1rem;
}

.nav-link:hover {
  background-color: rgba(255,255,255,0.1);
}

.nav-link.router-link-active {
  background-color: rgba(255,255,255,0.2);
}

@media (max-width: 768px) {
  .main-nav {
    padding: 1rem 0.5rem;
  }

  .nav-link {
    padding: 0.5rem;
  }
}
</style>
