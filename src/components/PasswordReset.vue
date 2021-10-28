<template>
  <div>
    <h2 class="mt-6 text-3xl font-extrabold text-gray-900">
      Reset Your Password
    </h2>

    <form action="#" class="mt-6 space-y-6">
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
          Send password reset email
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { reactive, computed } from 'vue'
import axios from 'axios'
import { useRoute, useRouter } from 'vue-router'
import {
  helpers,
  required,
  requiredIf,
  sameAs,
  minLength,
} from '@vuelidate/validators'
import { useVuelidate } from '@vuelidate/core'

// local states
const formData = reactive({
  password: '',
  confirm_password: '',
})
const token = window.localStorage.getItem('token')

// router
const route = useRoute()
const router = useRouter()

// validation
const rules = computed(() => {
  return {
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

// methods
async function submit() {
  v$.value.$touch()
  if (v$.value.$invalid) {
    return true
  }

  await axios.post(
    `http://localhost:4000/api/password-reset/${route?.params?.id}/${token}`,
    formData
  )

  window.localStorage.removeItem('token')
  router.push('/login')
}
</script>
