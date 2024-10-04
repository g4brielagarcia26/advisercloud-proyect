import { Routes } from "@angular/router";

// Aquí definimos todas las rutas de la página Usuarios.
// Este path solo puede contener rutas que sean privadas.
export default [
  {
    path:'',
    loadComponent: () => import('./user/user.component')
  }
] as Routes 