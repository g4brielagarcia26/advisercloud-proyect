import { Routes } from "@angular/router";
import { publicGuard } from "../../core/guards/auth.guards";

// Ruta hija para definir SigInComponent
export default [
  {
    path: 'log-in',
    loadComponent: () => import('./log-in/log-in.component'),
    canActivate: [publicGuard()]
  },
  {
    path: 'sign-up',
    loadComponent: () => import('./sign-up/sign-up.component'),
    canActivate: [publicGuard()]
  },
  {
    path: 'send-email',
    loadComponent: () => import('./send-email/send-email.component'),
    canActivate: [publicGuard()]
  },
  {
    path: 'forgot-password',
    loadComponent: () => import('./forgot-password/forgot-password.component'),
    canActivate: [publicGuard()]
  }
] as Routes