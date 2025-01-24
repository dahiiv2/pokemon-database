<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';
import VolverPokemons from './VolverPokemons.vue';

const route = useRoute();
const router = useRouter();
const pokemons = ref([]);
const moveDetails = ref(null);
const isLoading = ref(true);

const typeColors = {
    normal: '#A8A878',
    fire: '#F08030',
    water: '#6890F0',
    electric: '#F8D030',
    grass: '#78C850',
    ice: '#98D8D8',
    fighting: '#C03028',
    poison: '#A040A0',
    ground: '#E0C068',
    flying: '#A890F0',
    psychic: '#F85888',
    bug: '#A8B820',
    rock: '#B8A038',
    ghost: '#705898',
    dragon: '#7038F8',
    dark: '#705848',
    steel: '#B8B8D0',
    fairy: '#EE99AC'
};

async function fetchPokemonByMove() {
    isLoading.value = true;
    try {
        // First get move details
        const moveResponse = await axios.get(`https://pokeapi.co/api/v2/move/${route.params.move}`);
        moveDetails.value = {
            name: moveResponse.data.name,
            type: moveResponse.data.type.name,
            power: moveResponse.data.power,
            accuracy: moveResponse.data.accuracy,
            pp: moveResponse.data.pp,
            description: moveResponse.data.effect_entries.find(entry => entry.language.name === 'en')?.effect || 'No description available.'
        };

        // Then get all Pokémon that can learn this move
        const pokemonPromises = moveResponse.data.learned_by_pokemon.map(async (pokemon) => {
            const pokemonResponse = await axios.get(pokemon.url);
            return {
                id: pokemonResponse.data.id,
                name: pokemonResponse.data.name,
                types: pokemonResponse.data.types.map(type => type.type.name),
                image: pokemonResponse.data.sprites.other['official-artwork'].front_default || pokemonResponse.data.sprites.front_default
            };
        });

        pokemons.value = await Promise.all(pokemonPromises);
        pokemons.value.sort((a, b) => a.id - b.id);

    } catch (error) {
        console.error('Error fetching Pokemon data:', error);
        router.push("/pokemons/notfound");
    } finally {
        isLoading.value = false;
    }
}

onMounted(fetchPokemonByMove);
</script>

<template>
    <div class="move-container">
        <div v-if="!isLoading && moveDetails" class="move-content">
            <div class="move-header">
                <h1 class="move-title">
                    {{ moveDetails.name.replace('-', ' ') }}
                    <span 
                        class="move-type-badge"
                        :style="{ backgroundColor: typeColors[moveDetails.type] }"
                    >
                        {{ moveDetails.type }}
                    </span>
                </h1>
                <div class="move-stats">
                    <div class="move-stat" v-if="moveDetails.power">
                        <span class="stat-label">Power</span>
                        <span class="stat-value">{{ moveDetails.power }}</span>
                    </div>
                    <div class="move-stat" v-if="moveDetails.accuracy">
                        <span class="stat-label">Accuracy</span>
                        <span class="stat-value">{{ moveDetails.accuracy }}%</span>
                    </div>
                    <div class="move-stat">
                        <span class="stat-label">PP</span>
                        <span class="stat-value">{{ moveDetails.pp }}</span>
                    </div>
                </div>
                <p class="move-description">{{ moveDetails.description }}</p>
            </div>

            <h2 class="pokemon-section-title">Pokémon that can learn {{ moveDetails.name.replace('-', ' ') }}</h2>
            
            <div class="pokemon-grid">
                <RouterLink 
                    v-for="pokemon in pokemons" 
                    :key="pokemon.id"
                    :to="`/pokemons/${pokemon.name}`"
                    class="pokemon-card"
                >
                    <div class="pokemon-image-container">
                        <img :src="pokemon.image" :alt="pokemon.name" class="pokemon-image">
                    </div>
                    <div class="pokemon-info">
                        <span class="pokemon-number">#{{ pokemon.id.toString().padStart(3, '0') }}</span>
                        <h3 class="pokemon-name">{{ pokemon.name.replace('-', ' ') }}</h3>
                        <div class="pokemon-types">
                            <span 
                                v-for="type in pokemon.types" 
                                :key="type"
                                class="type-badge"
                                :style="{ backgroundColor: typeColors[type] }"
                            >
                                {{ type }}
                            </span>
                        </div>
                    </div>
                </RouterLink>
            </div>

            <VolverPokemons class="back-button" />
        </div>
        <div v-else-if="isLoading" class="loading">
            <div class="loading-spinner"></div>
            <p>Loading move data...</p>
        </div>
    </div>
</template>

<style scoped>
.move-container {
    flex: 1;
    display: flex;
    flex-direction: column;
    min-height: 100%;
    width: 100%;
    background-color: white;
}

.move-content {
    flex: 1;
    max-width: 1400px;
    margin: 0 auto;
    padding: 2rem;
    width: 100%;
}

.move-header {
    text-align: center;
    margin-bottom: 3rem;
    background: white;
    border-radius: 16px;
    padding: 2rem;
    box-shadow: 0 4px 8px rgba(0,0,0,0.05);
    border: 1px solid #eee;
}

.move-title {
    font-size: 3rem;
    color: #2c3e50;
    margin-bottom: 1.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    text-transform: capitalize;
    line-height: 1.2;
}

.move-type-badge {
    font-size: 1.1rem;
    padding: 0.7rem 2rem;
    border-radius: 30px;
    color: white;
    text-transform: uppercase;
    font-weight: 600;
    letter-spacing: 1px;
    box-shadow: 0 4px 8px rgba(0,0,0,0.2);
}

.move-stats {
    display: flex;
    justify-content: center;
    gap: 4rem;
    margin: 2rem 0;
    background: #f8f9fa;
    padding: 1.5rem;
    border-radius: 12px;
}

.move-stat {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
}

.stat-label {
    color: #666;
    font-size: 1.1rem;
    text-transform: uppercase;
    letter-spacing: 1px;
}

.stat-value {
    font-size: 1.4rem;
    font-weight: 600;
    color: #2c3e50;
}

.move-description {
    color: #666;
    font-size: 1.2rem;
    line-height: 1.8;
    max-width: 800px;
    margin: 2rem auto 0;
}

.pokemon-section-title {
    text-align: center;
    color: #2c3e50;
    font-size: 2rem;
    margin: 3rem 0;
    text-transform: capitalize;
    padding-bottom: 1rem;
    border-bottom: 2px solid #eee;
}

.pokemon-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 1.5rem;
    margin-bottom: 3rem;
}

.pokemon-card {
    background: white;
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 4px 8px rgba(0,0,0,0.05);
    border: 1px solid #eee;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    text-decoration: none;
    color: inherit;
}

.pokemon-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 16px rgba(0,0,0,0.1);
}

.pokemon-image-container {
    background: #f8f9fa;
    padding: 2rem;
    aspect-ratio: 1;
    display: flex;
    align-items: center;
    justify-content: center;
}

.pokemon-image {
    width: 100%;
    height: 100%;
    object-fit: contain;
    transition: transform 0.3s ease;
}

.pokemon-card:hover .pokemon-image {
    transform: scale(1.05);
}

.pokemon-info {
    padding: 1.5rem;
}

.pokemon-number {
    color: #666;
    font-size: 0.9rem;
}

.pokemon-name {
    margin: 0.5rem 0;
    color: #2c3e50;
    font-size: 1.3rem;
    font-weight: 600;
    text-transform: capitalize;
}

.pokemon-types {
    display: flex;
    gap: 0.8rem;
    margin-top: 0.8rem;
}

.type-badge {
    padding: 0.4rem 1rem;
    border-radius: 20px;
    color: white;
    font-size: 0.9rem;
    text-transform: uppercase;
    font-weight: 500;
    letter-spacing: 0.5px;
}

.loading {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 60vh;
    gap: 2rem;
}

.loading-spinner {
    width: 50px;
    height: 50px;
    border: 5px solid #f3f3f3;
    border-top: 5px solid #2196F3;
    border-radius: 50%;
    animation: spin 1s linear infinite;
}

@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}

.back-button {
    text-align: center;
    margin-top: 3rem;
}

@media (max-width: 1200px) {
    .move-content {
        padding: 1.5rem;
    }

    .pokemon-grid {
        gap: 1rem;
    }
}

@media (max-width: 900px) {
    .move-title {
        font-size: 2.5rem;
    }

    .move-stats {
        gap: 2rem;
        padding: 1rem;
    }

    .pokemon-grid {
        grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    }
}

@media (max-width: 600px) {
    .move-content {
        padding: 1rem;
    }

    .move-header {
        padding: 1.5rem;
        margin-bottom: 2rem;
    }

    .move-title {
        font-size: 2rem;
        flex-direction: column;
        gap: 0.8rem;
    }

    .move-type-badge {
        padding: 0.5rem 1.5rem;
        font-size: 0.9rem;
    }

    .move-stats {
        flex-wrap: wrap;
        gap: 1.5rem;
    }

    .move-stat {
        flex: 1;
        min-width: 100px;
    }

    .stat-value {
        font-size: 1.2rem;
    }

    .move-description {
        font-size: 1.1rem;
    }

    .pokemon-section-title {
        font-size: 1.6rem;
        margin: 2rem 0;
    }

    .pokemon-grid {
        grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    }

    .pokemon-info {
        padding: 1rem;
    }

    .pokemon-name {
        font-size: 1.1rem;
    }
}
</style>
