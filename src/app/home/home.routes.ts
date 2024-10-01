import { Routes } from "@angular/router";

// Aquí definimos todas las rutas del Home.

export default [
  {
    path: '',
    loadComponent: () => import('./home/home.component')
  }
] as Routes