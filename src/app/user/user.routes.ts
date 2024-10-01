import { Routes } from "@angular/router";

// Aquí definimos todas las rutas de la página Usuarios.

export default [
  {
    path:'',
    loadComponent: () => import('./user/user.component')
  }
] as Routes 