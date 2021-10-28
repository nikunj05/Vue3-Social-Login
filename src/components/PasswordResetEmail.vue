<template>
  <div>
    <h2 class="mt-6 text-3xl font-extrabold text-gray-900">
      Send Password Reset Email
    </h2>
    <p class="mt-6 text-sm font-medium text-gray-700">
      If that account is in our system, then you can reset your password. It
      happens to the best of us. Enter your email and we'll send you reset
      instructions.
    </p>
    <form action="#" class="mt-6 space-y-6">
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
import { useRouter } from 'vue-router'
import { helpers, required, email } from '@vuelidate/validators'
import { useVuelidate } from '@vuelidate/core'

// local states
const formData = reactive({
  email: '',
})

// router
const router = useRouter()

// validation
const rules = computed(() => {
  return {
    email: {
      required: helpers.withMessage('Field is required', required),
      email: helpers.withMessage('Incorrect Email.', email),
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

  const res = await axios.post(
    'http://localhost:4000/api/password-reset',
    formData
  )
  const id = res.data.user._id
  window.localStorage.setItem('token', res.data.token)
  router.push(`/password-reset/${id}`)
}
</script>
