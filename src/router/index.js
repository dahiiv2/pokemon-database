  import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import("../views/HomeView.vue")
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue'),
    },
    {
      path: '/pokemons',
      name: 'pokemons',
      component: () => import("../views/PokemonView.vue")
    },
    {
      path: "/pokemons/:nombre", //Utilizamos el 'Param' nombre
      name: "poke",
      component: () => import("../views/PokeView.vue")
    },
    {
      path: '/pokemons/notfound',
      name: "pokeNotFound",
      component: () => import("../views/NoPokeView.vue"),
    },
    {
      path: '/pokemons/ability/:abilidad',
      name: "pokeAbility",
      component: () => import("../views/PokemonViewAbility.vue"),
    },
    {
      path: '/pokemons/move/:move',
      name: "pokeMove",
      component: () => import("../views/PokemonByMoveView.vue"),
    },
    {
      path: '/:pathMatch(.*)*',
      name: "NotFound",
      component: () => import("../views/NotFoundView.vue"),
    }
  ],
})

export default router
