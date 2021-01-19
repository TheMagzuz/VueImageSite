import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import ImageView from "../components/ImageView.vue";
import ImageFocus from "../components/ImageFocus.vue";
import Login from "../components/Login.vue";
import Random from "../components/Random.vue";
import { VueCookieNext } from "vue-cookie-next";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/images",
    name: "Images",
    component: ImageView,
    children: [
      {
        path: ":id",
        component: ImageFocus,
      },
    ],
  },
  {
    path: "/",
    redirect: "/images",
  },
  {
    path: "/upload",
    name: "Upload",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../components/Upload.vue"),
  },
  {
    path: "/random",
    name: "Random",
    component: Random,
  },
  {
    path: "/login",
    name: "Login",
    component: Login,
    meta: {
      hideNav: true,
      noAuth: true,
    },
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

router.beforeEach((to, from, next) => {
  if (to.meta.noAuth) {
    next();
    return;
  }

  let jwt = VueCookieNext.getCookie("jwt");
  if (jwt) {
    next();
    return;
  } else {
    next({ name: "Login" });
  }
});

export default router;
