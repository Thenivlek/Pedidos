import { createRouter, createWebHistory } from "vue-router";
import Login from "../components/login.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "login",
      component: Login,
    },
    {
      path: "/login",
      name: "login",
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import("../components/login.vue"),
    },

    //{
    //  path: "/",
    //  name: "home",
    //  //component: HomeView,
    //},
    //{
    //  path: '/about',
    //  name: 'about',
    //  // route level code-splitting
    //  // this generates a separate chunk (About.[hash].js) for this route
    //  // which is lazy-loaded when the route is visited.
    //  component: () => import('../views/AboutView.vue')
    //}
  ],
});

export default router;
