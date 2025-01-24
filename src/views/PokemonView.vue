<script setup>
import axios from 'axios';
import { ref, onMounted, computed } from 'vue';

const allPokemons = ref([]);
const searchQuery = ref('');
const isLoading = ref(true);
const loadingProgress = ref(0);
const totalPokemon = ref(0);

// List of Pokemon forms to exclude
const excludedForms = [
    '-mega', '-gmax', '-eternamax', '-alola', '-galar', '-hisui',
    '-blade', '-crowned', '-black', '-white', '-dawn', '-dusk', '-ultra',
    '-primal', '-therian', '-sky', '-zen', '-pirouette', '-origin',
    '-sunshine', '-rainy', '-snowy', '-attack', '-defense', '-speed',
    '-sandy', '-trash', '-heat', '-wash', '-frost', '-fan', '-mow',
    '-altered', '-resolute', '-ash', '-school', '-complete',
    '-incarnate', '-ordinary', '-aria', '-red-striped', '-blue-striped',
    '-average', '-small', '-large', '-super', '-unbound', '-confined',
    '-shield', '-low-key', '-amped', '-ice', '-noice', '-hangry',
    '-busted', '-disguised', '-gorging', '-gulping', '-low-power',
    '-full-belly', '-hangry', '-indeedee-female', '-indeedee-male'
];

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

const filteredPokemons = computed(() => {
    const query = searchQuery.value.toLowerCase();
    return allPokemons.value.filter(pokemon => 
        pokemon.name.toLowerCase().includes(query) ||
        pokemon.id.toString().includes(query) ||
        pokemon.types.some(type => type.toLowerCase().includes(query))
    );
});

async function fetchPokemons() {
    try {
        isLoading.value = true;
        totalPokemon.value = 0;
        loadingProgress.value = 0;

        // First get the total count
        const countResponse = await axios.get('https://pokeapi.co/api/v2/pokemon?limit=1');
        totalPokemon.value = countResponse.data.count;

        // Get all Pokemon basic data
        const { data: allData } = await axios.get(`https://pokeapi.co/api/v2/pokemon?limit=${totalPokemon.value}`);
        
        // Filter out special forms and variants
        const filteredPokemon = allData.results.filter(pokemon => {
            const name = pokemon.name.toLowerCase();
            return !excludedForms.some(form => name.includes(form)) &&
                !name.includes('-totem') &&
                !name.endsWith('-f') &&
                !name.endsWith('-m') &&
                !name.includes('-mode') &&
                !name.includes('-style') &&
                !name.includes('-size') &&
                !name.includes('-cloak') &&
                !name.includes('-form') &&
                !name.includes('-color') &&
                !name.includes('-face') &&
                !name.includes('-pattern') &&
                !name.includes('-segment') &&
                !name.includes('-drive') &&
                !name.includes('-rotom') &&
                !name.includes('-mime') &&
                !/-\d/.test(name); // Exclude names with numbers
        });

        // Fetch detailed data for each Pokemon in batches
        const batchSize = 50;
        const batches = [];
        
        for (let i = 0; i < filteredPokemon.length; i += batchSize) {
            batches.push(filteredPokemon.slice(i, i + batchSize));
        }

        const pokemonList = [];
        
        for (const batch of batches) {
            const batchData = await Promise.all(
                batch.map(async pokemon => {
                    try {
                        const response = await axios.get(pokemon.url);
                        const data = response.data;
                        
                        // Only include if it's a base form (species number matches Pokemon number)
                        if (data.id <= 1010) { // Current max regular Pokemon number
                            return {
                                id: data.id,
                                name: pokemon.name.replace(/-+/g, ' '),
                                image: data.sprites.other['official-artwork'].front_default || data.sprites.front_default,
                                types: data.types.map(type => type.type.name)
                            };
                        }
                        return null;
                    } catch (error) {
                        console.error(`Error fetching details for ${pokemon.name}:`, error);
                        return null;
                    }
                })
            );
            
            pokemonList.push(...batchData.filter(p => p !== null));
            loadingProgress.value = (pokemonList.length / filteredPokemon.length) * 100;
        }

        // Sort by ID to maintain proper order
        allPokemons.value = pokemonList.sort((a, b) => a.id - b.id);
        
    } catch (error) {
        console.error('Error fetching Pokemon list:', error);
    } finally {
        isLoading.value = false;
    }
}

onMounted(() => {
    fetchPokemons();
});
</script>

<template>
    <div class="pokemon-list-container">
        <h1>Pokédex</h1>
        
        <div class="search-container">
            <input 
                type="text" 
                v-model="searchQuery"
                placeholder="Search by name, number or type..."
                class="search-input"
            >
        </div>

        <div v-if="isLoading" class="loading">
            <div class="loading-spinner"></div>
            <p>Loading Pokémon... {{ loadingProgress }}%</p>
            <div class="progress-bar">
                <div 
                    class="progress-bar-fill"
                    :style="{ width: `${loadingProgress}%` }"
                ></div>
            </div>
        </div>

        <div v-else>
            <p class="results-count" v-if="searchQuery">
                Found {{ filteredPokemons.length }} Pokémon
            </p>

            <div class="pokemon-grid">
                <RouterLink 
                    v-for="pokemon in filteredPokemons" 
                    :key="pokemon.id"
                    :to="`/pokemons/${pokemon.name}`"
                    class="pokemon-card"
                >
                    <div class="pokemon-image-container">
                        <img :src="pokemon.image" :alt="pokemon.name" class="pokemon-image">
                    </div>
                    <div class="pokemon-info">
                        <span class="pokemon-number">#{{ pokemon.id.toString().padStart(3, '0') }}</span>
                        <h2 class="pokemon-name">{{ pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1) }}</h2>
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
        </div>
    </div>
</template>

<style scoped>
.pokemon-list-container {
    flex: 1;
    width: 100%;
    min-height: 100%;
    padding: 1.5rem;
    background-color: #f0f2f5;
}

.search-container {
    max-width: 600px;
    margin: 0 auto 2rem;
    padding: 0 1rem;
}

.search-input {
    width: 100%;
    padding: 1rem 1.5rem;
    font-size: 1.1rem;
    border: 2px solid #e1e1e1;
    border-radius: 12px;
    background-color: white;
    transition: all 0.3s ease;
}

.search-input:focus {
    outline: none;
    border-color: #2196F3;
    box-shadow: 0 0 0 3px rgba(33, 150, 243, 0.1);
}

.results-count {
    text-align: center;
    color: #666;
    margin-bottom: 1rem;
    font-size: 1.1rem;
}

.pokemon-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 1rem;
    width: 100%;
}

.pokemon-card {
    background: white;
    border-radius: 12px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    overflow: hidden;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    text-decoration: none;
    color: inherit;
    height: 100%;
    display: flex;
    flex-direction: column;
}

.pokemon-card:hover {
    transform: translateY(-3px);
    box-shadow: 0 4px 8px rgba(0,0,0,0.2);
}

.pokemon-image-container {
    background: #f8f9fa;
    padding: 1rem;
    display: flex;
    justify-content: center;
    align-items: center;
    aspect-ratio: 1;
}

.pokemon-image {
    width: 100%;
    height: 100%;
    object-fit: contain;
}

.pokemon-info {
    padding: 1rem;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.pokemon-number {
    color: #666;
    font-size: 0.9rem;
}

.pokemon-name {
    margin: 0;
    font-size: 1.2rem;
    color: #2c3e50;
    text-transform: capitalize;
}

.pokemon-types {
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
}

.type-badge {
    padding: 0.3rem 0.8rem;
    border-radius: 16px;
    color: white;
    font-size: 0.8rem;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

.loading {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 300px;
}

.loading-spinner {
    width: 40px;
    height: 40px;
    border: 4px solid #f3f3f3;
    border-top: 4px solid #2196F3;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin-bottom: 1rem;
}

@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}

.progress-bar {
    width: 300px;
    height: 8px;
    background-color: #e1e1e1;
    border-radius: 4px;
    overflow: hidden;
    margin: 1rem auto;
}

.progress-bar-fill {
    height: 100%;
    background-color: #2196F3;
    transition: width 0.3s ease;
}

@media (max-width: 480px) {
    .search-container {
        padding: 0 0.5rem;
    }

    .search-input {
        padding: 0.8rem 1.2rem;
        font-size: 1rem;
    }

    .pokemon-grid {
        grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
        gap: 0.8rem;
    }

    .pokemon-info {
        padding: 0.8rem;
    }

    .pokemon-name {
        font-size: 1.1rem;
    }

    .type-badge {
        padding: 0.2rem 0.6rem;
        font-size: 0.75rem;
    }

    .progress-bar {
        width: 200px;
    }
}
</style>
