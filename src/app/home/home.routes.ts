import { Routes } from "@angular/router";

// Aquí definimos todas las rutas del Home.

export default [
  {
    path: '',
    loadComponent: () => import('./shared-components/layout/layout.component'),
    children:[
      {
        path:'user',
        loadComponent: () => import('../user/user/user.component'),
      }
    ]
  }
] as Routes