import { Routes } from "@angular/router";

// Ruta hija para definir SigInComponent
export default [
  {
    path: 'log-in',
    loadComponent: () => import('./log-in/log-in.component')
  },
  {
    path: 'sign-up',
    loadComponent: () => import('./sign-up/sign-up.component')
  }
] as Routes