import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'root',
      redirect: '/home',
      component: () => import('../layouts/default/index.vue'),
      children: [
        {
          path: '/home',
          name: 'home',
          component: () => import('../views/index.vue'),
        },
      ],
    },
  ],
})

export default router
