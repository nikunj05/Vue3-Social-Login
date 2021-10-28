<template>
  <div
    class="relative flex items-center justify-center h-screen overflow-y-hidden"
  >
    <div class="absolute inset-0">
      <img
        class="object-cover w-full h-full"
        src="../assets/signup.jpg"
        alt=""
      />
      <div class="absolute inset-0 mix-blend-multiply" />
    </div>
    <div class="relative z-10 w-full">
      <div
        class="flex flex-col justify-center w-full px-6 py-6 pt-8 md:py-12 md:pt-16 sm:px-32"
      >
        <div class="sm:mx-auto sm:w-full sm:max-w-md">
          <h2 class="mt-6 text-3xl font-extrabold text-center text-gray-100">
            Registration
          </h2>
        </div>

        <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div class="px-4 py-8 bg-white shadow sm:rounded-lg sm:px-10">
            <form class="space-y-6" action="#">
              <div>
                <label
                  for="name"
                  class="block text-sm font-medium text-gray-700"
                >
                  Name <span class="text-sm text-red-500"> *</span>
                </label>
                <div class="mt-1">
                  <input
                    v-model="formData.name"
                    type="text"
                    :class="[
                      { 'border border-red-500': v$.name.$error },
                      'block w-full px-3 py-2 placeholder-gray-400 border border-gray-300 rounded-md shadow-sm appearance-none focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm',
                    ]"
                    @input="v$.name.$touch()"
                  />
                  <span
                    v-if="v$.name.$error"
                    class="block mt-0.5 text-sm text-red-500"
                  >
                    {{ v$.name.$error && v$.name.$errors[0].$message }}
                  </span>
                </div>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700">
                  Email address <span class="text-sm text-red-500"> *</span>
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

              <div>
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

              <div>
                <label class="block text-sm font-medium text-gray-700">
                  Confirm Password <span class="text-sm text-red-500"> *</span>
                </label>
                <div class="mt-1">
                  <input
                    v-model="formData.confirm_password"
                    type="password"
                    :class="[
                      {
                        'border border-red-500': v$.confirm_password.$error,
                      },
                      'block w-full px-3 py-2 placeholder-gray-400 border border-gray-300 rounded-md shadow-sm appearance-none focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm',
                    ]"
                    @input="v$.confirm_password.$touch()"
                  />
                  <span
                    v-if="v$.confirm_password.$error"
                    class="block mt-0.5 text-sm text-red-500"
                  >
                    {{
                      v$.confirm_password.$error &&
                        v$.confirm_password.$errors[0].$message
                    }}
                  </span>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  class="flex justify-center w-full px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  @click.prevent="submit"
                >
                  Register
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { computed, reactive } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'
import {
  helpers,
  required,
  requiredIf,
  sameAs,
  minLength,
  email,
} from '@vuelidate/validators'
import { useVuelidate } from '@vuelidate/core'
import { useNotificationStore } from '../store/notification'
// Router
const router = useRouter()

// local states
const formData = reactive({
  name: '',
  email: '',
  password: '',
  confirm_password: '',
})

// validation
const rules = computed(() => {
  return {
    name: {
      required: helpers.withMessage('Field is required', required),
    },
    email: {
      required: helpers.withMessage('Field is required', required),
      email: helpers.withMessage('Incorrect Email.', email),
    },
    password: {
      required: helpers.withMessage('Field is required', required),
      minLength: helpers.withMessage(
        'Password must contain 6 characters',
        minLength(6)
      ),
    },
    confirm_password: {
      required: helpers.withMessage(
        'Field is required',
        requiredIf(formData.password)
      ),
      sameAsPassword: helpers.withMessage(
        'Passwords must be identical',
        sameAs(formData.password)
      ),
    },
  }
})

const v$ = useVuelidate(
  rules,
  computed(() => formData)
)

// store
const notificationStore = useNotificationStore()

// methods
async function submit() {
  v$.value.$touch()
  if (v$.value.$invalid) {
    return true
  }

  await axios
    .post('http://localhost:4000/api/register', formData)
    .then((res) => {
      if (res) {
        notificationStore.showNotification({
          type: 'success',
          message: 'Register Successfully',
        })
      }
    })
    .catch((err) => {
      if (err) {
        notificationStore.showNotification({
          type: 'error',
          message: err.response,
        })
      }
    })
  router.push('/login')
}
</script>
