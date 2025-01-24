<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

const volver = () => {
    router.push("/pokemons");
}
</script>

<template>
    <button @click="volver">Volver</button>
</template>

<style scoped>
button {
    border: none;
    background-color: greenyellow;
    border-radius: 100px;
    width: 33em;
    height: 4em;
    font-weight: bold;
    color: green;
}
</style>