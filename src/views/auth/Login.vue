<template>
  <div class="min-h-screen flex items-center justify-center">
    <div
      class="w-full bg-white rounded-lg shadow-md max-w-md mx-auto overflow-hidden"
    >
      <div
        class="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8"
      >
        <div class="sm:mx-auto sm:w-full sm:max-w-sm">
          <img
            class="mx-auto h-20 w-auto"
            src="@/assets/logo.png"
            alt="Your Company"
          />
          <h2
            class="mt-4 text-center text-2xl/9 font-bold tracking-tight text-black"
          >
            Inicia sesión en Nexus
          </h2>
        </div>

        <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <!-- ✅ CAMBIO 1: @submit.prevent llama a handleLogin -->
          <form class="space-y-6" @submit.prevent="handleLogin">
            <!-- ✅ CAMBIO 2: Cambiar "email" por "usuario" -->
            <div>
              <label
                for="usuario"
                class="block text-sm/6 font-medium text-gray-900"
              >
                Usuario
              </label>
              <div class="mt-2">
                <input
                  v-model="form.usuario"
                  type="text"
                  name="usuario"
                  id="usuario"
                  autocomplete="username"
                  required
                  class="block w-full rounded-md border-2 border-gray-300 px-3 py-1.5 text-base text-black outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
                  placeholder="Ingresa tu usuario"
                />
              </div>
            </div>

            <!-- ✅ CAMBIO 3: v-model para password -->
            <div>
              <div class="flex items-center justify-between">
                <label
                  for="password"
                  class="block text-sm/6 font-medium text-gray-900"
                >
                  Contraseña
                </label>
                <div class="text-sm">
                  <a
                    href="#"
                    class="font-semibold text-indigo-400 hover:text-indigo-300"
                  >
                    ¿Has olvidado tu contraseña?
                  </a>
                </div>
              </div>
              <div class="mt-2">
                <input
                  v-model="form.password"
                  type="password"
                  name="password"
                  id="password"
                  autocomplete="current-password"
                  required
                  class="block w-full rounded-md border-2 border-gray-300 px-3 py-1.5 text-base text-black outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
                  placeholder="Ingresa tu contraseña"
                />
              </div>
            </div>

            <!-- ✅ CAMBIO 4: Mostrar errores -->
            <div
              v-if="error"
              class="rounded-md bg-red-500/10 p-3 text-sm text-red-400"
            >
              {{ error }}
            </div>

            <!-- ✅ CAMBIO 5: Deshabilitar botón mientras carga -->
            <div>
              <button
                type="submit"
                :disabled="loading"
                class="flex w-full justify-center rounded-md bg-indigo-500 px-3 py-1.5 text-sm/6 font-semibold text-white hover:bg-indigo-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {{ loading ? "Cargando..." : "Iniciar sesión" }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import api from "@/utils/axios";

const router = useRouter();

// ✅ Estado del formulario
const form = ref({
  usuario: "",
  password: "",
});

// ✅ Estado de carga y errores
const loading = ref(false);
const error = ref("");

// ✅ Función que se ejecuta al enviar el formulario
const handleLogin = async () => {
  loading.value = true;
  error.value = "";

  try {
    const response = await api.post("/auth/login", {
      usuario: form.value.usuario,
      password: form.value.password,
    });

    // Guardar token en localStorage
    localStorage.setItem("token", response.data.token);
    localStorage.setItem("token_expiration", response.data.token_expiration);
    localStorage.setItem("user", JSON.stringify(response.data.user));

    // Redirigir al dashboard
    router.push("/dashboard");
  } catch (err: any) {
    if (err.response) {
      error.value = err.response.data.message || "Error al iniciar sesión";
    } else {
      error.value = "Error de conexión con el servidor";
    }
  } finally {
    loading.value = false;
  }
};
</script>
