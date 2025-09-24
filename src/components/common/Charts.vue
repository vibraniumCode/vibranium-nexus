<template>
  <div ref="chartRef" class="w-full h-[300px]"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch } from "vue";
import ApexCharts from "apexcharts";

interface Series {
  name: string;
  data: number[];
}

const props = defineProps<{
  categories: string[];
  series: Series[];
}>();

const chartRef = ref<HTMLDivElement | null>(null);
let chart: any = null;

async function renderChart() {
  if (!chartRef.value) return;

  const options = {
    chart: {
      type: "line",
      height: 300,
      toolbar: { show: false },
    },
    stroke: {
      curve: "smooth",
      lineCap: "round",
    },
    colors: ["#020617"],
    markers: { size: 4 },
    series: props.series,
    xaxis: {
      categories: props.categories,
      labels: {
        style: {
          colors: "#616161",
          fontSize: "12px",
          fontFamily: "inherit",
          fontWeight: 400,
        },
      },
    },
    yaxis: {
      labels: {
        style: {
          colors: "#616161",
          fontSize: "12px",
          fontFamily: "inherit",
          fontWeight: 400,
        },
      },
    },
    grid: {
      borderColor: "#ddd",
      strokeDashArray: 5,
    },
    tooltip: { theme: "dark" },
  };

  // destruye el gráfico anterior si existe
  if (chart) {
    chart.destroy();
  }

  chart = new ApexCharts(chartRef.value, options);
  chart.render();
}

onMounted(renderChart);
watch(() => [props.categories, props.series], renderChart, { deep: true });
onBeforeUnmount(() => {
  if (chart) chart.destroy();
});
</script>
