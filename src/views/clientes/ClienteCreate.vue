<template>
  <div class="h-full w-full mb-6 bg-white p-6 font-sans rounded-lg">
    <Form
      title="Nuevo Cliente"
      subtitle="Complete los datos para registrar un nuevo cliente"
      :fields="clienteFormFields"
      @submit="handleCreate"
      @cancel="goBack"
    />
  </div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import Form from "@/components/common/Form.vue";
import { clienteFormFields } from "@/constants/clienteConfig";
import { useClienteHandlers } from "@/composables/useClienteHandlers";

const router = useRouter();
const { handleClienteCreate } = useClienteHandlers(); // ✅ correcto

// 🟩 Crear nuevo cliente
const handleCreate = async (formData: Record<string, any>) => {
  const success = await handleClienteCreate(formData);

  if (success) {
    // Podés mostrar una alerta si querés
    // Swal.fire("Éxito", "El cliente se creó correctamente", "success");

    router.push("/clientes"); // vuelve al listado principal
  }
};

// 🔙 Cancelar y volver al listado
const goBack = () => {
  router.push("/clientes");
};
</script>
