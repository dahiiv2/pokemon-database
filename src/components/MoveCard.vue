<template>
    <RouterLink 
        :to="`/pokemons/move/${move.name}`"
        class="move-item"
        :class="{ 'is-hovered': isHovered }"
        :style="{ backgroundColor: `${typeColors[move.type]}22` }"
        @mouseenter="isHovered = true"
        @mouseleave="isHovered = false"
    >
        <div class="move-content">
            <span class="move-name">{{ move.name.replace('-', ' ') }}</span>
            <div class="move-details">
                <span class="move-type" 
                    :style="{ backgroundColor: typeColors[move.type] }">
                    {{ move.type }}
                </span>
                <span class="learn-method">({{ move.learnMethod }})</span>
            </div>
        </div>
        
        <!-- Expanded details on hover -->
        <transition name="slide">
            <div v-if="isHovered" class="move-expanded">
                <div class="move-stats">
                    <div class="move-stat" v-if="move.power !== null">
                        <span class="stat-label">Power</span>
                        <span class="stat-value">{{ move.power }}</span>
                    </div>
                    <div class="move-stat" v-if="move.accuracy !== null">
                        <span class="stat-label">Accuracy</span>
                        <span class="stat-value">{{ move.accuracy }}%</span>
                    </div>
                    <div class="move-stat">
                        <span class="stat-label">PP</span>
                        <span class="stat-value">{{ move.pp }}</span>
                    </div>
                </div>
            </div>
        </transition>
    </RouterLink>
</template>

<script setup>
import { ref } from 'vue';
import { RouterLink } from 'vue-router';

const props = defineProps({
    move: {
        type: Object,
        required: true
    },
    typeColors: {
        type: Object,
        required: true
    }
});

const isHovered = ref(false);
</script>

<style scoped>
.move-item {
    position: relative;
    padding: 1rem;
    border-radius: 8px;
    transition: all 0.2s ease;
    text-decoration: none;
    color: inherit;
    display: flex;
    flex-direction: column;
    border: 1px solid rgba(0,0,0,0.1);
    height: 100%;
    overflow: hidden;
}

.move-item.is-hovered {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.move-content {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.move-name {
    font-size: 1.1rem;
    font-weight: 500;
    text-transform: capitalize;
    color: #2c3e50;
}

.move-details {
    display: flex;
    align-items: center;
    gap: 0.8rem;
}

.move-type {
    padding: 0.3rem 0.8rem;
    border-radius: 20px;
    color: white;
    font-size: 0.9rem;
    text-transform: uppercase;
    font-weight: 500;
}

.learn-method {
    color: #666;
    font-size: 0.9rem;
    text-transform: capitalize;
}

.move-expanded {
    margin-top: 0.8rem;
    padding-top: 0.8rem;
    border-top: 1px solid rgba(0,0,0,0.1);
}

.move-stats {
    display: flex;
    justify-content: space-around;
    gap: 1rem;
}

.move-stat {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.2rem;
}

.stat-label {
    font-size: 0.8rem;
    color: #666;
    text-transform: uppercase;
}

.stat-value {
    font-size: 1rem;
    font-weight: 600;
    color: #2c3e50;
}

.slide-enter-active,
.slide-leave-active {
    transition: all 0.2s ease;
}

.slide-enter-from,
.slide-leave-to {
    opacity: 0;
    transform: translateY(-20px);
}
</style>
