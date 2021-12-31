import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Dashboard",
    component: () =>
      import(/* webpackChunkName: "dashboard" */ "../views/Dashboard.vue"),
  },
  {
    path: "/appointments",
    name: "Appointments",
    component: () =>
      import(
        /* webpackChunkName: "appointments" */ "../views/Appointments.vue"
      ),
  },
  {
    path: "/add-appointment",
    name: "AddAppointments",
    component: () =>
      import(
        /* webpackChunkName: "add-appointments" */ "../views/AddAppointments.vue"
      ),
  },
  {
    path: "/edit-appointment/:appointmentId",
    name: "AddAppointments",
    component: () =>
      import(
        /* webpackChunkName: "edit-appointments" */ "../views/AddAppointments.vue"
      ),
  },
  {
    path: "/settings",
    name: "Settings",
    component: () =>
      import(/* webpackChunkName: "settings" */ "../views/Settings.vue"),
  },
  {
    path: "*",
    name: "404",
    component: () => import(/* webpackChunkName: "404" */ "../views/404.vue"),
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
