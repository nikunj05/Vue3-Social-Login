<template>
  <div
    class="relative flex items-center justify-center w-full h-screen overflow-y-hidden"
  >
    <div class="absolute inset-0">
      <img
        class="object-cover w-full h-full"
        src="../assets/signup.jpg"
        alt=""
      />
      <div class="absolute inset-0 mix-blend-multiply" />
    </div>
    <div class="relative z-10 flex justify-center w-full">
      <div class="flex flex-col items-center p-5 bg-white rounded-md">
        <RegisterSuccess class="mt-12" />
        <div class="my-12 text-center">
          <h6 class="text-base font-semibold text-gray-900 md:text-xl">
            Your Account Registration has been successful!
          </h6>
          <p class="mt-2 text-base font-normal text-gray-500">
            Please check your inbox for an email on next steps.
          </p>
          <p>
            <router-link
              to="/login"
              class="inline-flex items-center px-6 py-3 mt-5 text-base font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Back to Login
            </router-link>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import RegisterSuccess from '../components/icon/RegisterSuccess.vue'
// import axios from 'axios'
// import { useRoute, useRouter } from 'vue-router'
// import { useNotificationStore } from '../store/notification'

// router
// const router = useRouter()
// const route = useRoute()

//store
// const notificationStore = useNotificationStore()

// function submit() {
//   axios
//     .post(`http://localhost:4000/api/verify-email`, {
//       id: route.params.id,
//     })
//     .then((res) => {
//       if (res) {
//         notificationStore.showNotification({
//           type: 'success',
//           message: res.data.message,
//         })
//         router.push('/login')
//       }
//     })
//     .catch((err) => {
//       if (err) {
//         notificationStore.showNotification({
//           type: 'error',
//           message: err.response.error,
//         })
//       }
//     })
// }
</script>
