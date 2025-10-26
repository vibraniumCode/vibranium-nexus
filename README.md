# INSTALAMOS
npm install preline
PRELINE -> Preline es una librería de componentes UI basada en Tailwind CSS que agrega interactividad (como acordeones, menús, tooltips, etc.) usando clases como hs-accordion, hs-dropdown, etc.


Vue Router es la librería oficial para manejar navegación en Vue:
npm install vue-router@4

@4 = versión 4 (compatible con Vue 3)
Te permite cambiar de página SIN recargar el navegador
Maneja URLs como /dashboard, /empresas, etc.
Sin router: Solo tendrías una página estática
Con router: Navegación entre múltiples páginas


npm install @fontsource/inter


npm install axios
npm install apexcharts


🎯 Propósito de cada archivo:

empresaConfig.ts: Configuración estática (columnas + campos del form)
useEmpresas.ts: Lógica de datos (fetch, update, estado)
useEmpresaHandlers.ts: Lógica de negocio (validaciones, confirmaciones)
Componente: UI + orquestación


npm install sweetalert2 -> para las alertas

backend:
npm install express jsonwebtoken bcryptjs cors dotenv
npm install -D typescript ts-node-dev @types/express @types/jsonwebtoken @types/bcryptjs @types/cors
npm install express-validator
npm install express-rate-limit





LOGIN
---

## **Flujo Completo**
```
1. Usuario escribe "admin" y "123456"
   ↓
2. Usuario hace clic en "Sign in"
   ↓
3. Se ejecuta handleLogin()
   ↓
4. Se envía POST a http://localhost:3000/api/auth/login
   ↓
5a. ✅ Si éxito:
    - Guarda token en localStorage
    - Redirige a /dashboard
   
5b. ❌ Si error:
    - Muestra mensaje de error en pantalla
```

---