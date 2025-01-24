<script setup>
    import axios from 'axios';
    import {ref} from 'vue';
    import { useRoute } from 'vue-router';
    
    const route = useRoute();

    const pokemons=ref([]);
    const getData = async () => {
    try { //esperamos a obtener los resultados del API
        const {data} = await axios.get(`https://pokeapi.co/api/v2/ability/${route.params.abilidad}`);

        pokemons.value = data.pokemon.map((item) => item.pokemon);

    }
        catch (error) { //si hay algun error lo muestro por consola
            console.log(error);
    }
};
    getData();
</script>

<template>
    <h1>Pokemons con habilidad {{ route.params.abilidad }}</h1>
    <ul>
        <li v-for="poke in pokemons">
            <RouterLink :to="`/pokemons/${poke.name}`">
            {{ poke.name }}
          </RouterLink>
        </li>
    </ul>
</template>

<style>
</style>
