<template>
  <div class="bg-white rounded-md shadow p-5 lg:p-3 flex flex-col gap-3 w-full">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <h3 class="text-sm font-medium text-gray-500">Ventas del día</h3>
      <div class="p-2 lg:p-0">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="30px"
          viewBox="0 -960 960 960"
          width="30px"
          fill="gray"
        >
          <path
            d="M843-399 562-117q-11 11-24 16t-27 5q-14 0-27-5t-24-16L116.7-460.3Q106-471 101-483.89T96-511v-281q0-29.7 21.15-50.85Q138.3-864 168-864h281q13.91 0 26.96 5 13.04 5 23.77 15.7L843-500q11 11 16 23.5t5 26.5q0 14-5.02 27.09Q853.96-409.83 843-399ZM511-168l281-281-343-343H168v281l343 343ZM264-636q25 0 42.5-17.5T324-696q0-25-17.5-42.5T264-756q-25 0-42.5 17.5T204-696q0 25 17.5 42.5T264-636Zm216 156Z"
          />
        </svg>
      </div>
    </div>

    <!-- Total -->
    <div class="text-3xl lg:text-2xl font-bold text-gray-900">
      $ {{ formatNumber(totalHoy) }}
    </div>

    <!-- Comparación -->
    <div class="flex items-center gap-2 text-sm">
      <span
        :class="variacion >= 0 ? 'text-green-600' : 'text-red-600'"
        class="font-semibold"
      >
        {{ variacion >= 0 ? "▲" : "▼" }}
        {{ Math.abs(variacion).toFixed(2) }}%
      </span>
      <span class="text-gray-500">vs ayer</span>
    </div>

    <!-- Tickets -->
    <div class="text-xs text-gray-500">🧾 {{ ticketsHoy }} tickets</div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

interface Props {
  totalHoy: number;
  totalAyer: number;
  ticketsHoy: number;
}

const props = defineProps<Props>();

const variacion = computed(() => {
  if (props.totalAyer === 0) return 100;
  return ((props.totalHoy - props.totalAyer) / props.totalAyer) * 100;
});

const formatNumber = (value: number) => {
  return value.toLocaleString("es-AR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};
</script>
