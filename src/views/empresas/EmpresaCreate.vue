<template>
  <div class="h-full w-full mb-6 bg-white p-6 font-sans rounded-lg">
    <Form
      title="Nueva Estación"
      subtitle="Complete los datos para registrar una nueva estación"
      :fields="empresaFormFields"
      @submit="handleCreate"
      @cancel="goBack"
    />
  </div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import Form from "@/components/common/Form.vue";
import { empresaFormFields } from "@/constants/empresaConfig";
import { useEmpresaHandlers } from "@/composables/useEmpresaHandlers";

const router = useRouter();
const { handleEmpresaCreate } = useEmpresaHandlers(); // ✅ correcto

// 🟩 Crear nueva empresa
const handleCreate = async (formData: Record<string, any>) => {
  const success = await handleEmpresaCreate(formData);

  if (success) {
    // Podés mostrar una alerta si querés
    // Swal.fire("Éxito", "La empresa se creó correctamente", "success");

    router.push("/empresas"); // vuelve al listado principal
  }
};

// 🔙 Cancelar y volver al listado
const goBack = () => {
  router.push("/empresas");
};
</script>
