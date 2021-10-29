<template>
  <div>
    <h2 class="mt-6 text-3xl font-extrabold text-gray-900">
      Sign in to your account
    </h2>
    <div class="mt-8">
      <div>
        <p class="text-sm font-medium text-gray-700">
          Register with
        </p>
        <router-link
          to="/register"
          class="inline-flex justify-center w-full px-4 py-2 my-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50"
        >
          Sign up
        </router-link>

        <p class="text-sm font-medium text-gray-700">
          Sign in with
        </p>

        <div class="grid grid-cols-2 gap-3 mt-1">
          <div>
            <FacebookAuth
              ref="authRef"
              :appId="1543448162683856"
              @authInitialized="true"
            />
            <button
              class="inline-flex justify-center w-full px-4 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50"
              @click="login"
            >
              <span class="sr-only">Sign in with Facebook</span>
              <svg
                class="w-5 h-5"
                aria-hidden="true"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fill-rule="evenodd"
                  d="M20 10c0-5.523-4.477-10-10-10S0 4.477 0 10c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V10h2.54V7.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V10h2.773l-.443 2.89h-2.33v6.988C16.343 19.128 20 14.991 20 10z"
                  clip-rule="evenodd"
                />
              </svg>
            </button>
          </div>

          <div>
            <button
              class="inline-flex justify-center w-full px-4 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50"
              @click.prevent="handleClickSignIn"
            >
              <span class="sr-only">Sign in with Google</span>
              <svg
                aria-hidden="true"
                focusable="false"
                data-prefix="fab"
                data-icon="google"
                class="w-5 h-5"
                role="img"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 488 512"
              >
                <path
                  fill="currentColor"
                  d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"
                ></path>
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div class="relative mt-6">
        <div class="absolute inset-0 flex items-center" aria-hidden="true">
          <div class="w-full border-t border-gray-300" />
        </div>
        <div class="relative flex justify-center text-sm">
          <span class="px-2 text-gray-500 bg-white">
            Or continue with
          </span>
        </div>
      </div>
    </div>
    <form action="#" class="mt-6 space-y-6">
      <div>
        <label class="block text-sm font-medium text-gray-700">
          Email <span class="text-sm text-red-500"> *</span>
        </label>
        <div class="mt-1">
          <input
            v-model="formData.email"
            type="email"
            :class="[
              { 'border border-red-500': v$.email.$error },
              'block w-full px-3 py-2 placeholder-gray-400 border border-gray-300 rounded-md shadow-sm appearance-none focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm',
            ]"
            @input="v$.email.$touch()"
          />
          <span
            v-if="v$.email.$error"
            class="block mt-0.5 text-sm text-red-500"
          >
            {{ v$.email.$error && v$.email.$errors[0].$message }}
          </span>
        </div>
      </div>

      <div class="space-y-1">
        <label class="block text-sm font-medium text-gray-700">
          Password <span class="text-sm text-red-500"> *</span>
        </label>
        <div class="mt-1">
          <input
            v-model="formData.password"
            type="password"
            :class="[
              {
                'border border-red-500': v$.password.$error,
              },
              'block w-full px-3 py-2 placeholder-gray-400 border border-gray-300 rounded-md shadow-sm appearance-none focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm',
            ]"
            @input="v$.password.$touch()"
          />

          <span
            v-if="v$.password.$error"
            class="block mt-0.5 text-sm text-red-500"
          >
            {{ v$.password.$error && v$.password.$errors[0].$message }}
          </span>
        </div>
      </div>

      <div class="flex items-center justify-between">
        <div class="flex items-center">
          <input
            id="remember-me"
            name="remember-me"
            type="checkbox"
            class="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
          />
          <label for="remember-me" class="block ml-2 text-sm text-gray-900">
            Remember me
          </label>
        </div>

        <div class="text-sm">
          <router-link
            to="/password-reset-email"
            class="font-medium text-indigo-600 hover:underline hover:text-indigo-500"
          >
            Forgot your password
          </router-link>
        </div>
      </div>

      <div>
        <button
          type="submit"
          class="flex justify-center w-full px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          @click.prevent="submit"
        >
          Sign in
        </button>
      </div>
    </form>
  </div>
</template>

<script>
import { reactive, computed } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'
import FacebookAuth from '../components/FacebookAuth.vue'
import { required, email, helpers } from '@vuelidate/validators'
import { useVuelidate } from '@vuelidate/core'
import { useNotificationStore } from '../store/notification'

export default {
  // components
  components: { FacebookAuth },

  // data
  data() {
    return {
      user: '',
      accessToken: null,
    }
  },

  // methods
  methods: {
    async handleClickSignIn() {
      try {
        const googleUser = await this.$gAuth.signIn()
        if (!googleUser) {
          return null
        }
        this.user = googleUser.getBasicProfile()
        this.$router.push(`/dashboard`)
      } catch (error) {
        console.log(error)
        return null
      }
    },

    async login() {
      this.accessToken = await this.$refs.authRef.login()
      window.localStorage.setItem('accessToken', this.accessToken)
      this.$router.push('/dashboard')
    },
  },

  setup() {
    // Router
    const router = useRouter()

    // local states
    const formData = reactive({
      email: '',
      password: '',
    })

    // validation
    const rules = {
      email: {
        required: helpers.withMessage('Field is required', required),
        email: helpers.withMessage('Incorrect Email.', email),
      },
      password: {
        required: helpers.withMessage('Field is required', required),
      },
    }

    const v$ = useVuelidate(
      rules,
      computed(() => formData)
    )

    //store
    const notificationStore = useNotificationStore()

    // methods
    async function submit() {
      try {
        await axios
          .post('http://localhost:4000/api/login', formData)
          .then((res) => {
            if (res) {
              notificationStore.showNotification({
                type: 'success',
                message: 'Login Successful',
              })
              let token = res.data.token
              localStorage.setItem('token', token)

              router.push('/dashboard')
            }
          })
          .catch((err) => {
            if (err) {
              notificationStore.showNotification({
                type: 'error',
                message: err.response.data.error,
              })
            }
          })
      } catch (err) {
        console.log(err)
      }
    }

    return {
      router,
      formData,
      submit,
      v$,
    }
  },
}
</script>
