<template>
  <div id="app" class="flex min-h-screen bg-white">
    <div
      class="flex flex-col justify-center flex-1 px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24"
    >
      <div class="w-full max-w-sm mx-auto lg:w-96">
        <div>
          <h2 class="mt-6 text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
        </div>

        <div class="mt-8">
          <div>
            <div>
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
              <div
                class="absolute inset-0 flex items-center"
                aria-hidden="true"
              >
                <div class="w-full border-t border-gray-300" />
              </div>
              <div class="relative flex justify-center text-sm">
                <span class="px-2 text-gray-500 bg-white">
                  Or continue with
                </span>
              </div>
            </div>
          </div>

          <div class="mt-6">
            <router-view />
          </div>
        </div>
      </div>
    </div>
    <div class="relative flex-1 hidden w-0 lg:block">
      <img
        class="absolute inset-0 object-cover w-full h-full"
        src="../../assets/bgimage.jpg"
        alt=""
      />
    </div>
  </div>
</template>

<script>
import FacebookAuth from '../FacebookAuth.vue'

export default {
  components: { FacebookAuth },

  data() {
    return {
      user: '',
      accessToken: null,
    }
  },

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
}
</script>
