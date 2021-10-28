import { createApp } from 'vue'
import App from './App.vue'
import router from './router.js'
import './index.css'
import GAuth from 'vue3-google-oauth2'
import dotenv from 'dotenv'
import { createPinia } from 'pinia'

const gauthOption = {
  clientId:
    '65095363694-sbtg2ol8r863iea2cisljte7hob863hj.apps.googleusercontent.com',
  scope: 'profile email',
  prompt: 'consent',
  fetch_basic_profile: true,
}

const app = createApp(App)

dotenv.config()

app.use(router)
app.use(dotenv)
app.use(createPinia())
app.use(GAuth, gauthOption)
app.mount('#app')
