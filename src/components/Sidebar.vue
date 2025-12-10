<template>
  <!-- Navigation Toggle -->
  <div class="lg:hidden py-16 text-center">
    <button
      type="button"
      class="py-2 px-3 inline-flex justify-center items-center gap-x-2 text-start border border-gray-800 text-sm font-medium rounded-lg shadow-2xs align-middle focus:outline-hidden bg-white text-neutral-800 hover:bg-neutral-200 focus:bg-neutral-200"
      aria-haspopup="dialog"
      aria-expanded="false"
      aria-controls="hs-sidebar-footer"
      aria-label="Toggle navigation"
      data-hs-overlay="#hs-sidebar-footer"
    >
      Open
    </button>
  </div>
  <!-- End Navigation Toggle -->

  <!-- Sidebar -->
  <div
    id="hs-sidebar-footer"
    class="hs-overlay [--auto-close:lg] lg:block lg:translate-x-0 lg:end-auto lg:bottom-0 w-64 hs-overlay-open:translate-x-0 -translate-x-full transition-all duration-300 transform h-full hidden fixed top-0 start-0 bottom-0 z-60 border-e bg-neutral-800 border-neutral-700"
    role="dialog"
    tabindex="-1"
    aria-label="Sidebar"
  >
    <div class="relative flex flex-col h-full max-h-full">
      <!-- Header -->
      <header class="p-4 flex justify-between items-center gap-x-2">
        <a
          class="flex-none font-semibold text-xl focus:outline-hidden focus:opacity-80 text-white"
          href="#"
          aria-label="Nexus"
          >Nexus</a
        >

        <div class="lg:hidden -me-2">
          <!-- Close Button -->
          <button
            type="button"
            class="flex justify-center items-center gap-x-3 size-6 border text-sm rounded-full disabled:opacity-50 disabled:pointer-events-none focus:outline-hidden bg-neutral-800 border-neutral-700 text-neutral-400 hover:bg-neutral-700 focus:bg-neutral-700 hover:text-neutral-200 focus:text-neutral-200"
            data-hs-overlay="#hs-sidebar-footer"
          >
            <svg
              class="shrink-0 size-4"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
            <span class="sr-only">Close</span>
          </button>
          <!-- End Close Button -->
        </div>
      </header>
      <!-- End Header -->

      <!-- Body -->
      <nav
        class="h-full overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-neutral-700 [&::-webkit-scrollbar-thumb]:bg-neutral-500"
      >
        <div
          class="hs-accordion-group pb-0 px-2 w-full flex flex-col flex-wrap"
          data-hs-accordion-always-open
        >
          <ul class="space-y-1">
            <li>
              <router-link
                to="/"
                class="flex items-center gap-x-3.5 py-2 px-2.5 text-sm rounded-lg focus:outline-hidden bg-indigo-600 hover:bg-indigo-400/50 focus:bg-indigo-400/50 text-white"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="20px"
                  viewBox="0 -960 960 960"
                  width="20px"
                  fill="#999999"
                >
                  <path
                    d="M96-576v-288h288v288H96Zm72-72h144v-144H168v144ZM96-96v-288h288v288H96Zm72-72h144v-144H168v144Zm408-408v-288h288v288H576Zm72-72h144v-144H648v144ZM576-96v-288h288v288H576Zm72-72h144v-144H648v144ZM312-648Zm0 336Zm336-336Zm0 336Z"
                  />
                </svg>
                Dashboard
              </router-link>
            </li>

            <!-- ✅ ENTIDADES ACCORDION -->
            <li class="hs-accordion">
              <button
                @click="toggleAccordion('entidades')"
                type="button"
                class="w-full text-start flex items-center gap-x-3.5 py-2 px-2.5 text-sm rounded-lg focus:outline-hidden bg-neutral-800 hover:bg-neutral-700 focus:bg-neutral-700 text-neutral-200 transition"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="20px"
                  viewBox="0 -960 960 960"
                  width="20px"
                  fill="#999999"
                >
                  <path
                    d="M696-600h72v-72h-72v72Zm0 156h72v-72h-72v72Zm0 156h72v-72h-72v72Zm-48 144v-72h192v-528H480v57l-72-52v-77h504v672H648Zm-600 0v-384l264-192 264 192v384H360v-192h-96v192H48Zm72-72h72v-192h240v192h72v-276L312-631 120-492v276Zm562-331ZM432-216v-192H192v192-192h240v192Z"
                  />
                </svg>

                Entidades

                <svg
                  :class="openAccordions.entidades ? 'rotate-180' : ''"
                  class="ms-auto size-4 text-neutral-400 transition-transform"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </button>

              <!-- ✅ SUBMENU ENTIDADES -->
              <div
                v-show="openAccordions.entidades"
                class="overflow-hidden transition-all duration-300"
              >
                <ul class="pt-1 ps-7 space-y-1">
                  <li>
                    <router-link
                      to="/empresas"
                      class="flex items-center gap-x-3.5 py-2 px-2.5 text-sm rounded-lg focus:outline-hidden bg-neutral-800 hover:bg-neutral-700 focus:bg-neutral-700 text-neutral-200"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        height="20px"
                        viewBox="0 -960 960 960"
                        width="20px"
                        fill="#999999"
                      >
                        <path
                          d="M384-120v-216l60-161q5-14 17.5-22.5T489-528h271q15 0 27.5 9.23T805-496l59 160v215.6q0 10.4-6.92 17.4-6.93 7-17.08 7h-24.41Q806-96 799-102.92q-7-6.93-7-17.08v-24H456v24q0 10.15-6.92 17.08Q442.15-96 432-96h-24.41Q398-96 391-102.92q-7-6.93-7-17.08Zm95-264h291l-26-72H506l-27 72Zm-23 72v96-96Zm59.79 84q15.21 0 25.71-10.29t10.5-25.5q0-15.21-10.29-25.71t-25.5-10.5q-15.21 0-25.71 10.29t-10.5 25.5q0 15.21 10.29 25.71t25.5 10.5Zm216 0q15.21 0 25.71-10.29t10.5-25.5q0-15.21-10.29-25.71t-25.5-10.5q-15.21 0-25.71 10.29t-10.5 25.5q0 15.21 10.29 25.71t25.5 10.5ZM240-408v-72h72v72h-72Zm168-192v-72h72v72h-72ZM240-264v-72h72v72h-72Zm0 144v-72h72v72h-72ZM96-96v-528h168v-192h360v216h-72v-144H336v192H168v456H96Zm360-120h336v-96H456v96Z"
                        />
                      </svg>
                      Empresas
                    </router-link>
                  </li>

                  <li>
                    <router-link
                      to="/clientes"
                      class="flex items-center gap-x-3.5 py-2 px-2.5 text-sm rounded-lg focus:outline-hidden bg-neutral-800 hover:bg-neutral-700 focus:bg-neutral-700 text-neutral-200"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        height="20px"
                        viewBox="0 -960 960 960"
                        width="20px"
                        fill="#999999"
                      >
                        <path
                          d="M395-480q-23.19 0-38.09-18Q342-516 348-538l17-88q8-42 40.5-68t74.02-26q42.48 0 74.98 26 32.5 26 40.5 68l17 88q5 23.2-9.5 40.6Q588-480 565-480H395Zm29-72h112l-12-60q-3-16-15.54-26t-28.5-10q-15.96 0-28.46 10T436-612l-12 60ZM132.09-432q-22.09 1-37.59-9Q79-451 74-470.6q-2-8.4-1-17.9 1-9.5 5-16.5l-1-3q-3-3-9.4-23.71Q66-543 70.5-553T83-571l2-3q2-17 15-30t31-13q5 0 19.32 5l2.68-1q5-5 12.33-8 7.34-3 15.59-3 10.08 0 18.58 3.5Q208-617 213-610q1 0 1.5.5t1.5.5q12.8 1 22.4 8.5 9.6 7.5 15.31 19.85Q256-574 255.5-567.5t-2.5 11.79q0 .89 1 3.53 6 6.18 10 14.68t4 17.5q0 2-5 19-1 2 0 4l2 16q0 20.18-17.5 34.59Q230-432 207-432h-74.91Zm660.41 0q-30.5 0-51.5-21.21t-21-51q0-10.83 3.5-20.31Q727-534 732-543l-32-28q-8-8-3.5-18.5T714-600h78q29.7 0 50.85 21.15Q864-557.7 864-528v18q0 32.17-20.5 55.09Q823-432 792.5-432ZM0-240v-60q0-53 49.5-78T168-403q15 0 30 1.5t30 4.5q-18 18-27 45.5t-9 51.5v60H0Zm240 0v-59.5q0-59.5 61-96T480-432q118 0 179 36.41 61 36.42 61 95.59v60H240Zm552-163q69 0 118.5 25t49.5 78v60H768v-60q0-24-8.5-51.5T732-397q15-3 29.79-4.5Q776.57-403 792-403Zm-312 43q-64 0-101 11.5T314-312h332q-29-25-65.5-36.5T480-360Zm1 48Zm-1-288Z"
                        />
                      </svg>
                      Clientes
                    </router-link>
                  </li>
                </ul>
              </div>
            </li>

            <!-- ✅ PUNTO DE VENTA ACCORDION -->
            <li class="hs-accordion">
              <button
                @click="toggleAccordion('puntoVenta')"
                type="button"
                class="w-full text-start flex items-center gap-x-3.5 py-2 px-2.5 text-sm rounded-lg focus:outline-hidden bg-neutral-800 hover:bg-neutral-700 focus:bg-neutral-700 text-neutral-200 transition"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="20px"
                  viewBox="0 -960 960 960"
                  width="20px"
                  fill="#999999"
                >
                  <path
                    d="M192-264v-312h72v312h-72Zm252 0v-312h72v312h-72ZM96-144v-72h768v72H96Zm600-120v-312h72v312h-72ZM96-624v-96l384-192 384 192v96H96Zm113-72h542-542Zm0 0h542L480-831 209-696Z"
                  />
                </svg>

                Punto de venta

                <svg
                  :class="openAccordions.puntoVenta ? 'rotate-180' : ''"
                  class="ms-auto size-4 text-neutral-400 transition-transform"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </button>

              <!-- ✅ SUBMENU PUNTO DE VENTA -->
              <div
                v-show="openAccordions.puntoVenta"
                class="overflow-hidden transition-all duration-300"
              >
                <ul class="pt-1 ps-7 space-y-1">
                  <li>
                    <router-link
                      to="/facturacion"
                      class="flex items-center gap-x-3.5 py-2 px-2.5 text-sm rounded-lg focus:outline-hidden bg-neutral-800 hover:bg-neutral-700 focus:bg-neutral-700 text-neutral-200"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        height="20px"
                        viewBox="0 -960 960 960"
                        width="20px"
                        fill="#999999"
                      >
                        <path
                          d="M144-96v-768l56 45 56-45 56 45 56-45 56 45 56-45 56 45 56-45 56 45 56-45 56 45 56-45v768l-56-45-56 45-56-45-56 45-56-45-56 45-56-45-56 45-56-45-56 45-56-45-56 45Zm144-216h384v-72H288v72Zm0-132h384v-72H288v72Zm0-132h384v-72H288v72Zm-72 360h528v-528H216v528Zm0-528v528-528Z"
                        />
                      </svg>
                      Facturación
                    </router-link>
                  </li>
                  <li>
                    <router-link
                      to="#"
                      class="flex items-center gap-x-3.5 py-2 px-2.5 text-sm rounded-lg focus:outline-hidden bg-neutral-800 hover:bg-neutral-700 focus:bg-neutral-700 text-neutral-200"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        height="20px"
                        viewBox="0 -960 960 960"
                        width="20px"
                        fill="#999999"
                      >
                        <path
                          d="M168-144q-29.7 0-50.85-21.15Q96-186.3 96-216v-600l64.32 64 63.36-64L288-752l64.32-64 63.36 64L480-816l64.32 64 63.36-64L672-752l64.32-64 63.36 64L864-816v600q0 29.7-21.15 50.85Q821.7-144 792-144H168Zm0-72h276v-216H168v216Zm348 0h276v-72H516v72Zm0-144h276v-72H516v72ZM168-504h624v-144H168v144Z"
                        />
                      </svg>
                      Tickets
                    </router-link>
                  </li>
                </ul>
              </div>
            </li>
          </ul>
        </div>
      </nav>
      <!-- End Body -->

      <!-- Footer -->
      <footer class="mt-auto p-2 border-t border-neutral-700">
        <!-- Account Dropdown -->
        <!--  ----------------- PERFIL USUARIO ----------------- -->
        <div class="mt-auto relative" @click="toggleMenuUser">
          <button
            type="button"
            class="flex items-center w-full p-3 text-sm font-medium text-white hover:text-gray-900 transition rounded-lg hover:bg-purple-100"
          >
            <img
              class="object-cover w-10 h-10 rounded-lg"
              :src="`https://ui-avatars.com/api/?background=0D8ABC&color=fff&name=${userNombre}`"
              alt="avatar"
            />

            <div class="ml-4 text-left">
              <p class="text-sm font-medium">
                {{ userNombre }}
              </p>
              <p class="text-xs text-gray-500">Ver opciones</p>
            </div>

            <svg
              :class="openUserMenu ? 'rotate-180' : ''"
              class="ml-auto w-4 h-4 transition-transform duration-200"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fill-rule="evenodd"
                d="M5.23 7.21a.75.75 0 011.06.02L10 10.583l3.71-3.354a.75.75 0 011.02 1.1l-4.202 3.8a.75.75 0 01-1.02 0l-4.2-3.8a.75.75 0 01.02-1.1z"
                clip-rule="evenodd"
              />
            </svg>
          </button>

          <!-- MENU DESPLEGABLE -->
          <transition name="fade">
            <div
              v-if="openUserMenu"
              class="absolute bottom-20 w-full bg-white shadow-lg rounded-lg border border-gray-200"
            >
              <button
                @click.stop="cerrarSesion"
                class="w-full text-left px-4 py-2 text-black hover:bg-purple-100 text-sm font-medium"
              >
                <div class="flex items-center gap-x-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="24px"
                    viewBox="0 -960 960 960"
                    width="24px"
                    fill="#1f1f1f"
                  >
                    <path
                      d="M480-80 280-280l56-56 104 103v-407h80v407l104-103 56 56L480-80ZM146-260q-32-49-49-105T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 59-17 115t-49 105l-58-58q22-37 33-78t11-84q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 43 11 84t33 78l-58 58Z"
                    />
                  </svg>
                  <p>Cerrar Sesión</p>
                </div>
              </button>
            </div>
          </transition>
        </div>
        <!-- ----------------- FIN PERFIL USUARIO ----------------- -->
      </footer>
      <!-- End Footer -->
    </div>
  </div>
  <!-- End Sidebar -->
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";

// ⚠️ Acá deberías traer el nombre del usuario logeado
const userNombre = localStorage.getItem("usuario") || "Usuario";

// Router para cambiar de página al cerrar sesión
const router = useRouter();

// Controla el menú del usuario
const openUserMenu = ref(false);

// ✅ CONTROLAR ACCORDIONS MANUALMENTE
const openAccordions = ref({
  entidades: false,
  puntoVenta: false,
});

// ✅ TOGGLE ACCORDION
const toggleAccordion = (key: string) => {
  openAccordions.value[key as keyof typeof openAccordions.value] =
    !openAccordions.value[key as keyof typeof openAccordions.value];
};

// Abre y cierra el menú del usuario
const toggleMenuUser = () => {
  openUserMenu.value = !openUserMenu.value;
};

// Cerrar sesión
const cerrarSesion = () => {
  // Eliminamos los datos del usuario (TOKEN, ID, etc.)
  localStorage.removeItem("token");
  localStorage.removeItem("usuario");

  // Redireccionamos hacia el login
  router.push("/auth/login");
};

// ✅ CERRAR MENÚ AL HACER CLICK AFUERA
onMounted(() => {
  document.addEventListener("click", (event: MouseEvent) => {
    const target = event.target as HTMLElement;
    const userButton = document.querySelector("[data-user-menu]");

    if (userButton && !userButton.contains(target)) {
      openUserMenu.value = false;
    }
  });
});
</script>
