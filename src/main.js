import { createApp } from 'vue'
import App from './App.vue'
import router from './router.js'
import './index.css'
import GAuth from 'vue3-google-oauth2'

const gauthOption = {
  clientId:
    '65095363694-sbtg2ol8r863iea2cisljte7hob863hj.apps.googleusercontent.com',
  scope: 'profile email',
  prompt: 'consent',
  fetch_basic_profile: true,
}

const app = createApp(App)

app.use(router)
app.mount('#app')
app.use(GAuth, gauthOption)
