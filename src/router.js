import { createRouter, createWebHistory } from 'vue-router'

const LayoutLogin = () => import('../src/components/layouts/LayoutLogin.vue')

const Login = () => import('../src/components/Login.vue')

const Registration = () => import('../src/components/Registration.vue')

const Dashboard = () => import('../src/views/Dashboard.vue')

const PasswordResetEmail = () =>
  import('../src/components/PasswordResetEmail.vue')

const PasswordReset = () => import('../src/components/PasswordReset.vue')

const routes = [
  {
    path: '/',
    component: LayoutLogin,
    children: [
      {
        path: '/',
        component: Login,
      },
      {
        path: 'login',
        name: 'login',
        component: Login,
      },
      {
        path: '/password-reset-email',
        name: 'password-reset-email',
        component: PasswordResetEmail,
      },
      {
        path: '/password-reset/:id',
        name: 'password-reset',
        component: PasswordReset,
      },
    ],
  },

  {
    path: '/register',
    name: 'register',
    component: Registration,
  },

  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard,
  },
]

const router = createRouter({
  history: createWebHistory(),
  linkActiveClass: 'active',
  routes,
})

export default router
