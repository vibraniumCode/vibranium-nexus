<template>
  <div class="h-full w-full flex flex-col">
    <div class="flex-1 bg-gray-200 p-2">
      <div class="h-full w-full p-6 lg:p-2 font-sans rounded-lg">
        <div class="flex items-center justify-between mb-4 mt-2 lg:mt-0">
          <div
            class="flex-col w-full justify-between rounded-md ring-1 ring-slate-300"
          >
            <div
              class="flex h-72 lg:h-42 w-full flex-col justify-between rounded-md bg-indigo-600 p-8 lg:p-3 text-white relative overflow-hidden shadow"
            >
              <div class="absolute inset-0"></div>

              <div class="relative z-10">
                <div class="flex items-center justify-between mb-6">
                  <div
                    class="flex space-x-2 items-center bg-white/30 rounded-md px-3 py-1"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      height="20px"
                      viewBox="0 -960 960 960"
                      width="20px"
                      fill="#ffffff"
                    >
                      <path
                        d="M216-600h528v-96H216v96Zm0 0v-96 96Zm0 504q-29.7 0-50.85-21.15Q144-138.3 144-168v-528q0-29 21.5-50.5T216-768h72v-96h72v96h240v-96h72v96h72q29 0 50.5 21.5T816-696v210q-17-7-35.03-11-18.04-4-36.97-6v-25H216v360h250q5 20 13.5 37.5T499-96H216Zm503.77 48Q640-48 584-104.23q-56-56.22-56-136Q528-320 584.23-376q56.22-56 136-56Q800-432 856-375.77q56 56.22 56 136Q912-160 855.77-104q-56.22 56-136 56ZM775-151l34-34-65-65v-86h-48v106l79 79Z"
                      />
                    </svg>
                    <span class="lg:text-[70%]">{{ fecha }} - {{ hora }}</span>
                  </div>
                </div>
                <div class="flex space-x-2 items-center">
                  <p class="text-white text-4xl lg:text-2xl">
                    Bienvenido a Nexus, {{ userNombre }}
                  </p>
                </div>
                <p class="text-white text-base mt-2 lg:mt-0">
                  Esto es lo que esta pasando con tu sistema.
                </p>
              </div>
              <img src="@/assets/descargar.svg" alt="Overlay Pattern"
              class="absolute bottom-0 right-0 w-100 h-68 z-0 lg:w-50 lg:h-40 "
            </div>
          </div>
        </div>
        <p class="text-xl mb-4 border-l-4 border-indigo-700 pl-2">Resumen</p>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4 mb-4">
          <KpiVentasDia
            :totalHoy="thoy"
            :totalAyer="tayer"
            :ticketsHoy="canticket"
          />
        </div>
        <div>
          <div class="flex space-x-2">
            <div class="bg-white place-items-center p-4 rounded-md shadow">
              <div class="bg-orange-400 rounded-md p-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="35px"
                  viewBox="0 -960 960 960"
                  width="35px"
                  fill="#ffffff"
                >
                  <path
                    d="M479.76-408Q420-408 378-450.24q-42-42.24-42-102T378.24-654q42.24-42 102-42T582-653.76q42 42.24 42 102T581.76-450q-42.24 42-102 42Zm.24-72q30 0 51-21t21-51q0-30-21-51t-51-21q-30 0-51 21t-21 51q0 30 21 51t51 21Zm0 396L144-291.23V-668l336-208 336 207.58V-291L480-84Zm0-84 144-89q-34-16-70-23.5t-74-7.5q-38 0-74 7.5T336-257l144 89ZM265-301q49-29 103.32-44 54.32-15 111.5-15t111.68 15Q646-330 695-301l49-30v-296.8L480-791 216-627.8V-331l49 30Zm215-179Z"
                  />
                </svg>
              </div>
              <p class="text-gray-600 mt-2 font-semibold">{{ clientes }}</p>
              <p class="text-gray-600 font-semibold lg:text-[90%]">Clientes</p>
            </div>
            <div class="bg-white place-items-center p-4 rounded-md shadow">
              <div class="bg-red-400 rounded-md p-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="35px"
                  viewBox="0 -960 960 960"
                  width="35px"
                  fill="#ffffff"
                >
                  <path
                    d="M480-744q-20 0-34-14t-14-34q0-16 10-36.5t38-59.5q28 39 38 59.5t10 36.93Q528-772 514-758t-34 14Zm-192 0q-20 0-34-14t-14-34q0-16 10-36.5t38-59.5q28 39 38 59.5t10 36.93Q336-772 322-758t-34 14Zm384 0q-20 0-34-14t-14-34q0-16 10-36.5t38-59.5q28 39 38 59.5t10 36.93Q720-772 706-758t-34 14ZM240-144v48q0 10.2-6.9 17.1Q226.2-72 216-72h-48q-10.2 0-17.1-6.9Q144-85.8 144-96v-312l78-195q7-21 25.6-33t41.4-12h382q22.8 0 41.4 12 18.6 12 25.6 33l78 195v312q0 10.2-6.9 17.1Q802.2-72 792-72h-48q-10.2 0-17.1-6.9Q720-85.8 720-96v-48H240Zm1-312h478l-48-120H289l-48 120Zm-25 72v168-168Zm96 132q20 0 34-14t14-34q0-20-14-34t-34-14q-20 0-34 14t-14 34q0 20 14 34t34 14Zm336 0q20 0 34-14t14-34q0-20-14-34t-34-14q-20 0-34 14t-14 34q0 20 14 34t34 14Zm-432 36h528v-168H216v168Z"
                  />
                </svg>
              </div>
              <p class="text-gray-600 mt-2 font-semibold">{{ estaciones }}</p>
              <p class="text-gray-600 font-semibold lg:text-[90%]">
                Estaciones
              </p>
            </div>
            <div class="bg-white place-items-center p-4 rounded-md shadow">
              <div class="bg-green-400 rounded-md p-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="35px"
                  viewBox="0 -960 960 960"
                  width="35px"
                  fill="#ffffff"
                >
                  <path
                    d="M192-144v-600q0-29.7 21.15-50.85Q234.3-816 264-816h240q29.7 0 50.85 21.15Q576-773.7 576-744v264h48q19.8 0 33.9 14.1Q672-451.8 672-432v192q0 20.4 13.8 34.2Q699.6-192 720-192q20.4 0 34.2-13.8Q768-219.6 768-240v-301q-11 6-22.94 9.5Q733.13-528 720-528q-40.32 0-68.16-27.84Q624-583.68 624-624q0-32.39 19.5-58.19Q663-708 695-716l-65-65 34-34 124 123q14 14 21 31.7 7 17.71 7 36.3v384q0 40.32-27.77 68.16-27.78 27.84-68 27.84Q680-144 652-171.84q-28-27.84-28-68.16v-192h-48v288H192Zm72-408h240v-192H264v192Zm456-24q20.4 0 34.2-13.8Q768-603.6 768-624q0-20.4-13.8-34.2Q740.4-672 720-672q-20.4 0-34.2 13.8Q672-644.4 672-624q0 20.4 13.8 34.2Q699.6-576 720-576ZM264-216h240v-264H264v264Zm240 0H270h234Z"
                  />
                </svg>
              </div>
              <p class="text-gray-600 mt-2 font-semibold">{{ combustibles }}</p>
              <p class="text-gray-600 font-semibold lg:text-[90%]">Tipo CB</p>
            </div>
            <div class="bg-white place-items-center p-4 rounded-md shadow">
              <div class="bg-blue-400 rounded-md p-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="35px"
                  viewBox="0 -960 960 960"
                  width="35px"
                  fill="#ffffff"
                >
                  <path
                    d="M480-48q-113 0-207.5-52.5T120-241v121H48v-240h240v72H175q48 76 128 122t177 46q75 0 140.5-28.5t114-77q48.5-48.5 77-114T840-480h72q0 90-34 168.5t-92.5 137Q727-116 648.5-82T480-48Zm-33-168v-48q-21-5-58.5-27T333-376l63-26q2 6 20 42.5t70 36.5q26 0 50.5-14.5T561-384q0-27-20.5-43.5T475-460q-31-11-78.5-35.5T349-585q0-3 13-49t86-62v-48h66v47q53 9 74.5 40t25.5 44l-59 25q-3-10-19-30t-53-20q-20 0-44 11.5T415-586q0 27 24.5 41t75.5 31q67 23 89.5 56.5T627-384q0 37-15 60t-34.5 36.5Q558-274 539.5-269t-26.5 6v47h-66ZM48-480q0-90 34-168.5t92.5-137Q233-844 311.5-878T480-912q113 0 207.5 52.5T840-719v-121h72v240H672v-72h113q-48-76-128-122t-177-46q-75 0-140.5 28.5t-114 77q-48.5 48.5-77 114T120-480H48Z"
                  />
                </svg>
              </div>
              <p class="text-gray-600 mt-2 font-semibold">{{ impuestos }}</p>
              <p class="text-gray-600 font-semibold lg:text-[90%]">Tipo Imp</p>
            </div>
            <div class="bg-white place-items-center p-4 rounded-md shadow">
              <div class="bg-indigo-600 rounded-md p-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="35px"
                  viewBox="0 -960 960 960"
                  width="35px"
                  fill="#ffffff"
                >
                  <path
                    d="M469-312h32v-34q30-5 50-23.5t20-50.5q0-32-21.5-48T501-497v-78q10 3 17.31 10.58 7.32 7.59 10.69 18.42l37-16q-8-23-25-35t-40-17v-34h-32v32.58q-29.25 3.15-49.63 21.55Q399-575.48 399-545q0 31 22.5 48.5t48.5 28.99V-385q-17-5-28-17.5T426-432l-37 15.7q8 29.3 28.87 48.31 20.87 19.02 51.13 23.24V-312Zm32-74v-69q11 5 20 14t9 20.67q0 13.33-8.5 22.33-8.5 9-20.5 12Zm-32-124q-11.38-5.79-20.69-13.89Q439-532 439-544.5t9-21q9-8.5 21-10.5v66ZM336-192q-120.34 0-204.17-83.76Q48-359.52 48-479.76T131.83-684q83.83-84 204.17-84h288q120.34 0 204.17 83.76 83.83 83.76 83.83 204T828.17-276Q744.34-192 624-192H336Zm0-72h288q89.64 0 152.82-63.18Q840-390.36 840-480q0-89.64-63.18-152.82Q713.64-696 624-696H336q-89.64 0-152.82 63.18Q120-569.64 120-480q0 89.64 63.18 152.82Q246.36-264 336-264Zm144-216Z"
                  />
                </svg>
              </div>
              <p class="text-gray-600 mt-2 font-semibold">
                Nº {{ ultimaFactura }}
              </p>
              <p class="text-gray-600 font-semibold lg:text-[90%]">
                Ult Factura
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import imagenEstaciones from "@/assets/2016-04-16-roman-drits-barnimages-001.jpg";
import KpiVentasDia from "@/components/KpiVentasDia.vue";
import { ref, onMounted, onUnmounted } from "vue";
import { useInforme } from "@/composables/useInforme";

// Composables
const { getResumen } = useInforme();

const fecha = ref<string>("");
const hora = ref<string>("");
let relojHandle: number | null = null;
const clientes = ref<number>(0);
const estaciones = ref<number>(0);
const combustibles = ref<number>(0);
const impuestos = ref<number>(0);
const ultimaFactura = ref<number>(0);
const thoy = ref<number>(0);
const tayer = ref<number>(0);
const canticket = ref<number>(0);

const actualizarFechaHora = () => {
  const now = new Date();

  // Fecha en formato local (ej: 14/12/2025)
  fecha.value = now.toLocaleDateString("es-AR");

  // Hora en formato HH:MM:SS
  const hh = String(now.getHours()).padStart(2, "0");
  const mm = String(now.getMinutes()).padStart(2, "0");
  const ss = String(now.getSeconds()).padStart(2, "0");
  hora.value = `${hh}:${mm}:${ss}`;
};

onMounted(() => {
  actualizarFechaHora(); // set inicial
  relojHandle = window.setInterval(actualizarFechaHora, 1000);
  generarResumen();
});

onUnmounted(() => {
  if (relojHandle !== null) {
    clearInterval(relojHandle);
    relojHandle = null;
  }
});

// ⚠️ Acá deberías traer el nombre del usuario logeado
const userNombre = (() => {
  const userData = localStorage.getItem("user");
  if (userData) {
    try {
      const parsed = JSON.parse(userData);
      return parsed.nombre || parsed.usuario || "Usuario";
    } catch (e) {
      return "Usuario";
    }
  }
  return "Usuario";
})();

const generarResumen = async () => {
  try {
    const response = await getResumen();
    // Si viene como array
    if (Array.isArray(response) && response.length > 0) {
      const data = response[0];
      clientes.value = data.Clientes;
      estaciones.value = data.Estaciones;
      combustibles.value = data.Combustible;
      impuestos.value = data.Impuestos;
      ultimaFactura.value = data.Factura;
      thoy.value = data.Thoy;
      tayer.value = data.Tayer;
      canticket.value = data.CantTicket;
    }
  } catch (error) {
    console.error("Error al obtener resumen:", error);
  }
};
</script>
<style>
.color-bg {
  background-image: linear-gradient(to top, #a18cd1 0%, #fbc2eb 100%);
}
</style>
