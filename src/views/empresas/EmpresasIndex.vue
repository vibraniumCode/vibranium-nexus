<!-- src/views/empresas/EmpresasIndex.vue -->
<template>
  <div class="empresas-index">
    <!-- Header -->
    <div class="page-header">
      <h1>Empresas</h1>
      <RouterLink :to="{ name: 'empresas.crear' }" class="btn btn-primary">
        <i class="bi bi-plus-circle"></i> Nueva Empresa
      </RouterLink>
    </div>

    <!-- Filtros y búsqueda -->
    <div class="filters-section">
      <div class="search-box">
        <i class="bi bi-search"></i>
        <input 
          v-model="searchTerm" 
          type="text" 
          placeholder="Buscar por nombre, CUIT o dirección..."
          class="form-control"
        >
      </div>
      <div class="filter-chips">
        <button 
          :class="['chip', { active: filter === 'todas' }]"
          @click="filter = 'todas'"
        >
          Todas ({{ stats.total }})
        </button>
        <button 
          :class="['chip', { active: filter === 'activas' }]"
          @click="filter = 'activas'"
        >
          Activas ({{ stats.activas }})
        </button>
        <button 
          :class="['chip', { active: filter === 'inactivas' }]"
          @click="filter = 'inactivas'"
        >
          Inactivas ({{ stats.inactivas }})
        </button>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="loading-container">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Cargando...</span>
      </div>
    </div>

    <!-- Error -->
    <div v-else-if="error" class="alert alert-danger">
      <i class="bi bi-exclamation-triangle"></i>
      {{ error }}
      <button @click="loadEmpresas" class="btn btn-sm btn-outline-danger ms-2">
        Reintentar
      </button>
    </div>

    <!-- Tabla de empresas -->
    <div v-else-if="filteredEmpresas.length > 0" class="table-responsive">
      <table class="table table-hover">
        <thead>
          <tr>
            <th @click="sortBy('nombre')" class="sortable">
              Nombre
              <i :class="getSortIcon('nombre')"></i>
            </th>
            <th @click="sortBy('cuit')" class="sortable">
              CUIT
              <i :class="getSortIcon('cuit')"></i>
            </th>
            <th>Dirección</th>
            <th>Localidad</th>
            <th>Provincia</th>
            <th class="text-center">Estado</th>
            <th class="text-center">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="empresa in paginatedEmpresas" :key="empresa.id">
            <td>
              <RouterLink 
                :to="{ name: 'empresas.detalle', params: { id: empresa.id } }"
                class="text-decoration-none fw-medium"
              >
                {{ empresa.nombre }}
              </RouterLink>
            </td>
            <td>{{ formatCuit(empresa.cuit) }}</td>
            <td>{{ empresa.direccion }}</td>
            <td>{{ empresa.localidad }}</td>
            <td>{{ empresa.provincia }}</td>
            <td class="text-center">
              <span :class="['badge', empresa.activa ? 'bg-success' : 'bg-secondary']">
                {{ empresa.activa ? 'Activa' : 'Inactiva' }}
              </span>
            </td>
            <td class="text-center">
              <div class="btn-group btn-group-sm">
                <RouterLink 
                  :to="{ name: 'empresas.detalle', params: { id: empresa.id } }"
                  class="btn btn-outline-info"
                  title="Ver detalle"
                >
                  <i class="bi bi-eye"></i>
                </RouterLink>
                <RouterLink 
                  :to="{ name: 'empresas.editar', params: { id: empresa.id } }"
                  class="btn btn-outline-primary"
                  title="Editar"
                >
                  <i class="bi bi-pencil"></i>
                </RouterLink>
                <button 
                  @click="toggleEmpresaStatus(empresa)"
                  :class="['btn', empresa.activa ? 'btn-outline-warning' : 'btn-outline-success']"
                  :title="empresa.activa ? 'Desactivar' : 'Activar'"
                >
                  <i :class="empresa.activa ? 'bi bi-pause' : 'bi bi-play'"></i>
                </button>
                <button 
                  @click="confirmDelete(empresa)"
                  class="btn btn-outline-danger"
                  title="Eliminar"
                >
                  <i class="bi bi-trash"></i>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Sin resultados -->
    <div v-else class="no-results">
      <i class="bi bi-inbox"></i>
      <p>No se encontraron empresas</p>
      <RouterLink :to="{ name: 'empresas.crear' }" class="btn btn-primary">
        Crear primera empresa
      </RouterLink>
    </div>

    <!-- Paginación -->
    <nav v-if="totalPages > 1" aria-label="Paginación">
      <ul class="pagination justify-content-center">
        <li class="page-item" :class="{ disabled: currentPage === 1 }">
          <button class="page-link" @click="currentPage--" :disabled="currentPage === 1">
            Anterior
          </button>
        </li>
        <li 
          v-for="page in displayedPages" 
          :key="page"
          class="page-item" 
          :class="{ active: currentPage === page }"
        >
          <button class="page-link" @click="currentPage = page">
            {{ page }}
          </button>
        </li>
        <li class="page-item" :class="{ disabled: currentPage === totalPages }">
          <button class="page-link" @click="currentPage++" :disabled="currentPage === totalPages">
            Siguiente
          </button>
        </li>
      </ul>
    </nav>

    <!-- Modal de confirmación -->
    <div v-if="showDeleteModal" class="modal-backdrop">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Confirmar eliminación</h5>
            <button @click="showDeleteModal = false" class="btn-close"></button>
          </div>
          <div class="modal-body">
            <p>¿Está seguro que desea eliminar la empresa <strong>{{ empresaToDelete?.nombre }}</strong>?</p>
            <p class="text-muted">Esta acción no se puede deshacer.</p>
          </div>
          <div class="modal-footer">
            <button @click="showDeleteModal = false" class="btn btn-secondary">
              Cancelar
            </button>
            <button @click="deleteEmpresa" class="btn btn-danger">
              Eliminar
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import type { Empresa } from '@/types/empresa'
import { empresasService } from '@/services/empresasService'

// Estado
const empresas = ref<Empresa[]>([])
const loading = ref(true)
const error = ref<string | null>(null)
const searchTerm = ref('')
const filter = ref<'todas' | 'activas' | 'inactivas'>('todas')
const sortField = ref<keyof Empresa>('nombre')
const sortOrder = ref<'asc' | 'desc'>('asc')
const currentPage = ref(1)
const itemsPerPage = 10
const showDeleteModal = ref(false)
const empresaToDelete = ref<Empresa | null>(null)

// Computed
const stats = computed(() => ({
  total: empresas.value.length,
  activas: empresas.value.filter(e => e.activa).length,
  inactivas: empresas.value.filter(e => !e.activa).length
}))

const filteredEmpresas = computed(() => {
  let result = [...empresas.value]
  
  // Filtro por estado
  if (filter.value === 'activas') {
    result = result.filter(e => e.activa)
  } else if (filter.value === 'inactivas') {
    result = result.filter(e => !e.activa)
  }
  
  // Búsqueda
  if (searchTerm.value) {
    const search = searchTerm.value.toLowerCase()
    result = result.filter(e => 
      e.nombre.toLowerCase().includes(search) ||
      e.cuit.includes(search) ||
      e.direccion.toLowerCase().includes(search) ||
      e.localidad.toLowerCase().includes(search)
    )
  }
  
  // Ordenamiento
  result.sort((a, b) => {
    const aVal = a[sortField.value]
    const bVal = b[sortField.value]
    
    if (aVal < bVal) return sortOrder.value === 'asc' ? -1 : 1
    if (aVal > bVal) return sortOrder.value === 'asc' ? 1 : -1
    return 0
  })
  
  return result
})

const totalPages = computed(() => 
  Math.ceil(filteredEmpresas.value.length / itemsPerPage)
)

const paginatedEmpresas = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredEmpresas.value.slice(start, end)
})

const displayedPages = computed(() => {
  const pages: number[] = []
  const maxPages = 5
  let start = Math.max(1, currentPage.value - 2)
  let end = Math.min(totalPages.value, start + maxPages - 1)
  
  if (end - start < maxPages - 1) {
    start = Math.max(1, end - maxPages + 1)
  }
  
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  
  return pages
})

// Métodos
const loadEmpresas = async () => {
  try {
    loading.value = true
    error.value = null
    empresas.value = await empresasService.getAll()
  } catch (err) {
    error.value = 'Error al cargar las empresas. Por favor, intente nuevamente.'
    console.error('Error:', err)
  } finally {
    loading.value = false
  }
}

const formatCuit = (cuit: string): string => {
  // Formato: XX-XXXXXXXX-X
  if (cuit.length === 11) {
    return `${cuit.slice(0, 2)}-${cuit.slice(2, 10)}-${cuit.slice(10)}`
  }
  return cuit
}

const sortBy = (field: keyof Empresa) => {
  if (sortField.value === field) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortField.value = field
    sortOrder.value = 'asc'
  }
}

const getSortIcon = (field: keyof Empresa): string => {
  if (sortField.value !== field) return 'bi bi-chevron-expand'
  return sortOrder.value === 'asc' ? 'bi bi-chevron-up' : 'bi bi-chevron-down'
}

const toggleEmpresaStatus = async (empresa: Empresa) => {
  try {
    await empresasService.toggleActive(empresa.id, !empresa.activa)
    empresa.activa = !empresa.activa
  } catch (err) {
    error.value = 'Error al cambiar el estado de la empresa'
    console.error('Error:', err)
  }
}

const confirmDelete = (empresa: Empresa) => {
  empresaToDelete.value = empresa
  showDeleteModal.value = true
}

const deleteEmpresa = async () => {
  if (!empresaToDelete.value) return
  
  try {
    await empresasService.delete(empresaToDelete.value.id)
    empresas.value = empresas.value.filter(e => e.id !== empresaToDelete.value!.id)
    showDeleteModal.value = false
    empresaToDelete.value = null
  } catch (err) {
    error.value = 'Error al eliminar la empresa'
    console.error('Error:', err)
  }
}

// Lifecycle
onMounted(() => {
  loadEmpresas()
})
</script>

<style scoped>
.empresas-index {
  padding: 2rem;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.page-header h1 {
  margin: 0;
  color: #2c3e50;
}

.filters-section {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  margin-bottom: 2rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.search-box {
  position: relative;
  margin-bottom: 1rem;
}

.search-box i {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #6c757d;
}

.search-box input {
  padding-left: 38px;
}

.filter-chips {
  display: flex;
  gap: 0.5rem;
}

.chip {
  padding: 0.5rem 1rem;
  border: 1px solid #dee2e6;
  background: white;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s;
}

.chip:hover {
  background: #f8f9fa;
}

.chip.active {
  background: #007bff;
  color: white;
  border-color: #007bff;
}

.loading-container {
  display: flex;
  justify-content: center;
  padding: 3rem;
}

.table {
  background: white;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.sortable {
  cursor: pointer;
  user-select: none;
}

.sortable:hover {
  background: #f8f9fa;
}

.sortable i {
  margin-left: 0.5rem;
  font-size: 0.8em;
}

.no-results {
  text-align: center;
  padding: 3rem;
  background: white;
  border-radius: 8px;
}

.no-results i {
  font-size: 3rem;
  color: #dee2e6;
  margin-bottom: 1rem;
}

.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1050;
}

.modal-dialog {
  background: white;
  border-radius: 8px;
  width: 90%;
  max-width: 500px;
}

.modal-header {
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #dee2e6;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-body {
  padding: 1.5rem;
}

.modal-footer {
  padding: 1rem 1.5rem;
  border-top: 1px solid #dee2e6;
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  text-decoration: none;
}

.btn-primary {
  background: #007bff;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
}

.btn-primary:hover {
  background: #0056b3;
}
</style>