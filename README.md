# Historify - Control de Historial Clínico
---
Requerimientos del proyecto:
- MySQL 8.2 o superior
- Node.js 21.2.0 o superior
- NPM 10.2.5 o superior
- TypeScript 5.2.2 o superior

Dependencias:
- Express 4.18.2
- Kysely 0.26.3
- mySql2 3.6.5

## Correr el proyecto
Para correr el proyecto, clonar el repositorio con:
```git
git clone 
```
Una vez clonado, se instalan las dependencias del proyecto con npm:
```npm
npm install
```
Antes de correr el proyecto, se debe crear un archivo TypeScript llamado config.ts en la ruta del proyecto, del que consume el contexto de la base de datos. Debe lucir de forma similar a:
```typescript
export const config = {
    database: 'consultorio',
    host: 'localhost',
    user: 'root',
    password: 'root',
    port: 3306,
}
```
Adicionalmente, en la carpeta sql se encuentra el script para generar las tablas correspondientes. Las 3 tablas de la aplicación se encuentran en el schema consultorio.
Una vez hecho todo esto, puede correrse el proyecto con:
```
npm run buildstart
```
El comando `buildstart` automáticamente compila el proyecto TypeScript a una carpeta `./build`, e inicia el servidor de express en `localhost:3000`.