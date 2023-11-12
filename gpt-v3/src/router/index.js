import {createRouter, createWebHistory} from "vue-router";

const routes = [
    {
        path: "/",
        name: "login",
        component: () => import("../views/login.vue"),
    },
    {
        path: "/reg",
        name: "reg",
        component: () => import("../views/reg.vue"),
    },
    {
        path: "/index",
        name: "Index",
        component: () => import("../views/index.vue"),
        props:true,
    },

];

const router = createRouter({
    history: createWebHistory(),
    routes
});


router.beforeEach(((to, from, next) => {
        next();
    }
))

router.afterEach(() => {

})


export default router