// composables/useEmpresas.ts
import { ref } from "vue";
import axios from "axios";
import type { Empresa } from "@/types/empresa";

export function useEmpresas() {
  const empresas = ref<Empresa[]>([]);

  const fetchEmpresas = async () => {
    try {
      const { data } = await axios.get<Empresa[]>(
        "http://localhost:3000/api/empresas"
      );

      if (Array.isArray(data)) {
        empresas.value = data;
      } else {
        console.error("Error: la respuesta no es un array");
      }
    } catch (error) {
      console.error("Error al obtener empresas:", error);
    }
  };

  return { empresas, fetchEmpresas };
}
