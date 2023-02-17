import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'UserCartView',
      component: () => import('../views/UserCartView.vue'),
    },
  ],
});

export default router;
