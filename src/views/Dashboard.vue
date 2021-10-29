<template>
  <div>
    <div class="z-10 flex justify-end px-5 py-2 bg-gray-100 shadow-lg">
      <button
        type="button"
        class="inline-flex items-center px-6 py-2 text-base font-medium text-white border border-transparent rounded-md shadow-sm bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        @click="logout"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="w-6 h-6 mr-2"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
          />
        </svg>
        Log out
      </button>
    </div>
    <div class="relative">
      <div class="absolute inset-0">
        <img
          class="object-cover w-full h-full"
          src="../assets/register.jpg"
          alt=""
        />
        <div class="absolute inset-0 mix-blend-multiply" />
      </div>
      <div
        class="relative px-4 py-24 mx-auto max-w-7xl sm:py-32 sm:px-6 lg:px-8"
      >
        <h1
          class="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl"
        >
          Welcome To dashboard
        </h1>

        <!-- facebook details -->

        <FacebookAuth
          :appId="1543448162683856"
          @authInitialized="true"
          ref="authRef"
        />

        <div
          v-if="profile"
          class="relative w-1/2 p-4 mt-5 bg-white rounded-lg group"
        >
          <div
            class="relative overflow-hidden bg-white rounded-lg h-80 group-hover:opacity-75 sm:aspect-w-2 sm:aspect-h-1 sm:h-64 lg:aspect-w-1 lg:aspect-h-1"
          >
            <img
              v-if="image"
              :src="image"
              alt=""
              class="object-cover object-center w-full h-full"
            />
          </div>
          <h3 v-if="name" class="mt-6 text-lg text-gray-500">
            <span class="absolute inset-0" />
            Name: {{ name }}
          </h3>
          <p v-if="email" class="text-lg font-semibold text-gray-900">
            Email: {{ email }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import FacebookAuth from '../components/FacebookAuth.vue'
import axios from 'axios'

export default {
  components: {
    FacebookAuth,
  },

  data() {
    return {
      profile: '',

      email: '',
      image: '',
      name: '',
    }
  },

  mounted() {
    const token = window.localStorage.getItem('token')
    if (!token) {
      this.fetchData()
    }
  },

  methods: {
    async logout() {
      const token = window.localStorage.getItem('token')
      if (token) {
        window.localStorage.removeItem('token')
      }

      // facebook logout
      if (this.$refs.authRef) {
        this.$refs.authRef.logout()
        window.localStorage.removeItem('accessToken')
      }

      // google logout
      if (this.$gAuth) {
        await this.$gAuth.signOut()
      }

      this.$router.push('/login')
    },

    async fetchData() {
      // getting google details
      this.profile = this.$gAuth.instance.currentUser.get().getBasicProfile()
      if (this.profile) {
        this.email = this.profile.getEmail()
        this.name = this.profile.getName()
        this.image = this.profile.getImageUrl()
      }

      // getting facebook details
      const accessToken = window.localStorage.getItem('accessToken')
      if (accessToken) {
        const res = await axios.get(
          `https://graph.facebook.com/me/?fields=name,email,picture&access_token=${accessToken}`
        )
        this.profile = res.data

        if (res.data) {
          this.name = res.data.name
          this.email = res.data.email
          this.image = res.data.picture.data.url
        }
      }
    },
  },
}
</script>
