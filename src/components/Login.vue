<template>
  <form action="#" class="space-y-6">
    <div>
      <label class="block text-sm font-medium text-gray-700">
        Email
      </label>
      <div class="mt-1">
        <input
          v-model="formData.email"
          type="email"
          required=""
          class="block w-full px-3 py-2 placeholder-gray-400 border border-gray-300 rounded-md shadow-sm appearance-none focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      </div>
    </div>

    <div class="space-y-1">
      <label class="block text-sm font-medium text-gray-700">
        Password
      </label>
      <div class="mt-1">
        <input
          v-model="formData.password"
          type="password"
          required=""
          class="block w-full px-3 py-2 placeholder-gray-400 border border-gray-300 rounded-md shadow-sm appearance-none focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
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
        <a
          href="/register"
          class="font-medium text-indigo-600 hover:text-indigo-500"
        >
          Sign Up
        </a>
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
</template>
<script setup>
import { reactive } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'

// Router
const router = useRouter()

const formData = reactive({
  email: '',
  password: '',
})

async function submit() {
  try {
    let response = await axios.post('http://localhost:4000/api/login', formData)
    let token = response.data.token
    localStorage.setItem('token', token)
    if (token) {
      router.push('/dashboard')
    }
  } catch (err) {
    console.log(err)
  }
}
</script>
