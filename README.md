# CRUD-TARJETAS

## 📌 Description

Proyecto Backend Cards desarrollado con NestJS, usando TypeScript. Este backend expone endpoints RESTful para autenticación y gestión de tarjetas, integrando buenas prácticas como modularización, validación con DTOs, guards, interceptors y uso de decoradores personalizados.

## ⚙️ Project setup

Requisitos técnicos:

- Node.js v22.0.0  
- NPM v10.5.1  
- NestJS CLI  
- TypeScript

Instalar dependencias:

```bash
npm install
```

Entono de desarrollo
```bash
npm run start
```

Correr con cambios guardados automáticamente
```bash
npm run start:dev
```

Modo producción
```bash
npm run start:prod
```

Estructura del proyecto:
```txt
src/
├── auth/         → Módulo de autenticación
├── card/         → Módulo para gestión de tarjetas
├── common/       → Código reutilizable compartido entre módulos
├── database/     → Configuración de la base de datos
├── app.module.ts → Módulo principal del proyecto
├── main.ts       → Punto de entrada de la aplicación


```txt
Como clonar el repositorio:
```txt
git clone <url-del-repositorio>


Crea tu .env utilizando .env.example como base

La dirección para ver la documentación de apis con swagger es: /api
por ejemplo: http://localhost:3001/api


