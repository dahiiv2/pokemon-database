<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';
import VolverPokemons from './VolverPokemons.vue';
import MoveCard from '../components/MoveCard.vue';

const route = useRoute();
const router = useRouter();
const pokemon = ref(null);
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

const getStatColor = (value) => {
    if (value >= 150) return '#33cccc';
    if (value >= 120) return '#4CAF50';
    if (value >= 90) return '#8BC34A';
    if (value >= 60) return '#FFC107';
    return '#FF5722';
};

async function fetchPokemonData() {
    try {
        isLoading.value = true;
        const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${route.params.nombre}`);
        const data = response.data;

        // Fetch move details with full data
        const movePromises = data.moves.map(async (moveData) => {
            try {
                const moveResponse = await axios.get(moveData.move.url);
                const moveDetails = moveResponse.data;
                return {
                    name: moveData.move.name,
                    learnMethod: moveData.version_group_details[0].move_learn_method.name,
                    type: moveDetails.type.name,
                    power: moveDetails.power,
                    accuracy: moveDetails.accuracy,
                    pp: moveDetails.pp,
                    effect: moveDetails.effect_entries.find(e => e.language.name === 'en')?.effect || ''
                };
            } catch (error) {
                console.error(`Error fetching move ${moveData.move.name}:`, error);
                return null;
            }
        });

        const movesWithTypes = (await Promise.all(movePromises)).filter(move => move !== null);

        pokemon.value = {
            id: data.id,
            name: data.name,
            height: (data.height / 10).toFixed(1),
            weight: (data.weight / 10).toFixed(1),
            types: data.types.map(type => type.type.name),
            stats: data.stats.map(stat => ({
                name: stat.stat.name
                    .replace('special-attack', 'Sp. Atk')
                    .replace('special-defense', 'Sp. Def')
                    .split('-')
                    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(' '),
                value: stat.base_stat
            })),
            abilities: data.abilities.map(ability => ({
                name: ability.ability.name,
                isHidden: ability.is_hidden
            })),
            sprites: data.sprites,
            moves: movesWithTypes
        };

        // Fetch species data for flavor text
        const speciesResponse = await axios.get(`https://pokeapi.co/api/v2/pokemon-species/${data.id}`);
        const speciesData = speciesResponse.data;
        
        const englishFlavorText = speciesData.flavor_text_entries.find(
            entry => entry.language.name === 'en'
        );
        
        pokemon.value.flavorText = englishFlavorText 
            ? englishFlavorText.flavor_text.replace(/[\n\f]/g, ' ')
            : 'No description available.';

    } catch (error) {
        console.error('Error fetching Pokemon data:', error);
        router.push("/pokemons/notfound");
    } finally {
        isLoading.value = false;
    }
}

onMounted(fetchPokemonData);
</script>

<template>
    <div class="pokemon-container">
        <div v-if="isLoading" class="loading">
            <div class="loading-spinner"></div>
            <p>Loading Pokémon data...</p>
        </div>
        <div v-else-if="pokemon" class="pokemon-content-wrapper">
            <div class="pokemon-header">
                <h1 class="pokemon-name">
                    {{ pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1) }}
                </h1>
                <span class="pokemon-id">#{{ String(pokemon.id).padStart(3, '0') }}</span>
            </div>

            <div class="pokemon-content">
                <div class="pokemon-main-info">
                    <div class="pokemon-image-container">
                        <img 
                            :src="pokemon.sprites.other['official-artwork'].front_default || pokemon.sprites.front_default" 
                            :alt="pokemon.name"
                            class="pokemon-image"
                        >
                    </div>

                    <div class="pokemon-details">
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

                        <div class="pokemon-info">
                            <div class="info-item">
                                <span class="info-label">Height</span>
                                <span class="info-value">{{ pokemon.height }} m</span>
                            </div>
                            <div class="info-item">
                                <span class="info-label">Weight</span>
                                <span class="info-value">{{ pokemon.weight }} kg</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="pokemon-stats-abilities">
                    <div class="card">
                        <h2>Base Stats</h2>
                        <div class="stats-container">
                            <div 
                                v-for="stat in pokemon.stats" 
                                :key="stat.name"
                                class="stat-item"
                            >
                                <div class="stat-info">
                                    <span class="stat-name">{{ stat.name }}</span>
                                    <span class="stat-value">{{ stat.value }}</span>
                                </div>
                                <div class="stat-bar-container">
                                    <div 
                                        class="stat-bar"
                                        :style="{ 
                                            width: `${(stat.value / 255) * 100}%`,
                                            backgroundColor: getStatColor(stat.value)
                                        }"
                                    ></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="card">
                        <h2>Abilities</h2>
                        <div class="abilities-container">
                            <div 
                                v-for="ability in pokemon.abilities" 
                                :key="ability.name"
                                class="ability-item"
                            >
                                <span class="ability-name">
                                    {{ ability.name.replace('-', ' ') }}
                                </span>
                                <span v-if="ability.isHidden" class="hidden-ability">
                                    (Hidden)
                                </span>
                            </div>
                        </div>
                    </div>

                    <div class="card">
                        <h2>Moves</h2>
                        <div class="moves-container">
                            <MoveCard 
                                v-for="move in pokemon.moves.slice(0, 20)" 
                                :key="move.name"
                                :move="move"
                                :typeColors="typeColors"
                            />
                        </div>
                    </div>
                </div>
            </div>
            <VolverPokemons class="back-button" />
        </div>
        <div v-else class="error">
            <p>No Pokémon data available</p>
            <VolverPokemons class="back-button" />
        </div>
    </div>
</template>

<style scoped>
.pokemon-container {
    width: 100%;
    min-height: 100vh;
    background-color: #f5f5f5;
    padding: 2rem;
}

.pokemon-content-wrapper {
    width: 100%;
    max-width: 1400px;
    margin: 0 auto;
    background: white;
    border-radius: 20px;
    padding: 2rem;
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.pokemon-header {
    text-align: center;
    margin-bottom: 2rem;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1rem;
}

.pokemon-name {
    font-size: 3rem;
    font-weight: 700;
    color: #2c3e50;
    margin: 0;
    line-height: 1.2;
    text-transform: capitalize;
}

.pokemon-id {
    color: #666;
    font-size: 2.2rem;
}

.pokemon-content {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 3rem;
}

.pokemon-main-info {
    display: grid;
    grid-template-columns: 400px 1fr;
    gap: 3rem;
    align-items: start;
    width: 100%;
}

.pokemon-image-container {
    background-color: #f8f9fa;
    border-radius: 16px;
    padding: 2rem;
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    aspect-ratio: 1;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
}

.pokemon-image {
    width: 100%;
    height: 100%;
    object-fit: contain;
}

.pokemon-details {
    display: flex;
    flex-direction: column;
    gap: 2rem;
    height: 100%;
}

.pokemon-types {
    display: flex;
    gap: 1.5rem;
    justify-content: flex-start;
}

.type-badge {
    padding: 0.5rem 1.5rem;
    border-radius: 25px;
    color: white;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 1px;
    font-size: 1rem;
    box-shadow: 0 2px 4px rgba(0,0,0,0.2);
}

.pokemon-info {
    display: flex;
    gap: 3rem;
}

.info-item {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.info-label {
    color: #666;
    font-size: 1.1rem;
    text-transform: uppercase;
    letter-spacing: 1px;
}

.info-value {
    font-size: 1.4rem;
    font-weight: 600;
    color: #2c3e50;
}

.pokemon-stats-abilities {
    display: flex;
    flex-direction: column;
    gap: 2rem;
    width: 100%;
}

.card {
    width: 100%;
    background: white;
    border-radius: 16px;
    padding: 2rem;
    box-shadow: 0 4px 12px rgba(0,0,0,0.05);
    border: 1px solid rgba(0,0,0,0.1);
}

.card h2 {
    font-size: 1.8rem;
    color: #2c3e50;
    margin: 0 0 1.5rem 0;
    padding-bottom: 0.8rem;
    border-bottom: 2px solid #eee;
}

.stats-container {
    display: flex;
    flex-direction: column;
    gap: 1.2rem;
}

.stat-item {
    display: flex;
    align-items: center;
    gap: 1.5rem;
}

.stat-info {
    min-width: 150px;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.stat-name {
    color: #666;
    font-weight: 500;
    font-size: 1.1rem;
}

.stat-value {
    font-size: 1.2rem;
    font-weight: 600;
    color: #2c3e50;
}

.stat-bar-container {
    flex-grow: 1;
    background: #eee;
    height: 12px;
    border-radius: 6px;
    overflow: hidden;
    box-shadow: inset 0 2px 4px rgba(0,0,0,0.1);
}

.stat-bar {
    height: 100%;
    border-radius: 6px;
    transition: width 0.3s ease;
}

.abilities-container {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
}

.ability-item {
    background: #f8f9fa;
    padding: 0.8rem 1.5rem;
    border-radius: 25px;
    display: flex;
    align-items: center;
    gap: 0.8rem;
    transition: all 0.2s ease;
    border: 2px solid transparent;
}

.ability-item:hover {
    transform: translateY(-2px);
    border-color: #2196F3;
    box-shadow: 0 4px 8px rgba(33, 150, 243, 0.1);
}

.ability-name {
    text-decoration: none;
    color: #2196F3;
    font-weight: 500;
    text-transform: capitalize;
}

.hidden-ability {
    font-size: 0.9rem;
    color: #666;
}

.moves-container {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 1.5rem;
    padding: 1rem;
}

@media (max-width: 600px) {
    .moves-container {
        grid-template-columns: 1fr;
        padding: 0.5rem;
    }
}

.back-button {
    margin-top: 2rem;
    text-align: center;
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

.error {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 60vh;
    gap: 2rem;
}

@media (max-width: 1200px) {
    .pokemon-container {
        padding: 1rem;
    }
    
    .pokemon-content-wrapper {
        padding: 1.5rem;
    }
}

@media (max-width: 900px) {
    .pokemon-main-info {
        grid-template-columns: 1fr;
        gap: 2rem;
    }

    .pokemon-image-container {
        max-width: 350px;
        width: 100%;
        margin: 0 auto;
    }

    .pokemon-details {
        width: 100%;
        align-items: center;
    }

    .pokemon-types {
        justify-content: center;
    }

    .pokemon-info {
        justify-content: center;
    }

    .info-item {
        align-items: center;
    }
}

@media (max-width: 600px) {
    .pokemon-content-wrapper {
        padding: 1rem;
    }

    .pokemon-name {
        font-size: 2.2rem;
    }

    .pokemon-id {
        font-size: 1.6rem;
        display: block;
        margin: 0.5rem 0;
    }

    .pokemon-image-container {
        max-width: 280px;
    }

    .type-badge {
        padding: 0.4rem 1rem;
        font-size: 0.9rem;
    }

    .stat-item {
        flex-direction: column;
        align-items: flex-start;
        gap: 0.5rem;
    }

    .stat-info {
        width: 100%;
    }
}
</style>
