<script></script>

<template>
  <div class="not-found-container">
    <div class="content">
      <img 
        src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/54.png" 
        alt="Confused Psyduck" 
        class="psyduck"
      >
      <h1>404 - Page Not Found!</h1>
      <p class="message">Oh no! Psyduck is confused...</p>
      <p class="submessage">The page you're looking for seems to have used Teleport!</p>
      <RouterLink to="/" class="home-button">
        Return to Home
      </RouterLink>
    </div>
  </div>
</template>

<style scoped>
.not-found-container {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #f0f2f5 0%, #e0e5ec 100%);
  padding: 1rem;
}

.content {
  text-align: center;
  max-width: 600px;
  padding: 2rem;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  animation: float 6s ease-in-out infinite;
}

.psyduck {
  width: 200px;
  height: 200px;
  margin-bottom: 1rem;
  animation: wobble 2s ease-in-out infinite;
}

h1 {
  color: #2c3e50;
  font-size: 2.5rem;
  margin-bottom: 1rem;
  font-weight: bold;
}

.message {
  color: #e74c3c;
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.submessage {
  color: #7f8c8d;
  font-size: 1.2rem;
  margin-bottom: 2rem;
}

.home-button {
  display: inline-block;
  background-color: #3498db;
  color: white;
  padding: 1rem 2rem;
  border-radius: 30px;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s ease;
  border: none;
  cursor: pointer;
}

.home-button:hover {
  background-color: #2980b9;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(52, 152, 219, 0.3);
}

@keyframes float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-20px);
  }
}

@keyframes wobble {
  0%, 100% {
    transform: rotate(-5deg);
  }
  50% {
    transform: rotate(5deg);
  }
}

@media (max-width: 480px) {
  .content {
    padding: 1.5rem;
  }

  .psyduck {
    width: 150px;
    height: 150px;
  }

  h1 {
    font-size: 2rem;
  }

  .message {
    font-size: 1.2rem;
  }

  .submessage {
    font-size: 1rem;
  }

  .home-button {
    padding: 0.8rem 1.6rem;
  }
}
</style>