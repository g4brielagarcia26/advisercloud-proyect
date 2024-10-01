import { Routes } from "@angular/router";
import { publicGuard } from "../../core/guards/auth.guards";

// Ruta hija para definir SigInComponent
export default [
  {
    canActivateChild: [publicGuard()],
    path: 'log-in',
    loadComponent: () => import('./log-in/log-in.component')
  },
  {
    canActivateChild: [publicGuard()],
    path: 'sign-up',
    loadComponent: () => import('./sign-up/sign-up.component')
  }
] as Routes