import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import ImageView from "../components/ImageView.vue";
import ImageFocus from "../components/ImageFocus.vue";

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
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
