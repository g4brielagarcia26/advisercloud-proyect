import { Routes } from "@angular/router";

// Aquí definimos todas las rutas de la página Usuarios.
// Este path solo puede contener rutas que sean privadas.
export default [
  {
    path:'profile',
    loadComponent: () => import('./user/user.component')
  },
  {
    path: 'admin-create',
    loadComponent: () => import('./admin/create/create.component')
  },
  {
    path:'admin-modify',
    loadComponent: () => import('./admin/modify/modify.component')
  },
  {
    path:'admin-delete',
    loadComponent: () => import('./admin/delete/delete.component')
  },
] as Routes 