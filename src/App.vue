<template>
  <div class="flex h-screen">
    <Sidebar class="w-64 flex-shrink-0 h-full fixed left-0 top-0 z-20" />
    <div class="flex flex-col flex-1 min-w-0 ml-64 h-screen">
      <!--<Navbar class="z-10" />-->
      <main class="flex-1 overflow-auto bg-gray-200">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import Sidebar from './components/Sidebar.vue'
import Navbar from './components/Navbar.vue'
</script>