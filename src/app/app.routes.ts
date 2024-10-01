import { Routes } from '@angular/router';
import { publicGuard, privateGuard } from './core/guards/auth.guards';

export const routes: Routes = [
  {
    path: '', // Ruta vacía redirige a Home
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    // Guardia que protege la ruta, permitiendo el acceso solo si se cumplen las condiciones.
    canActivateChild: [publicGuard()], 
    path: 'home',
    // Carga las rutas hijas desde auth.routes de forma asíncrona.
    loadChildren: () => import('./home/home.routes'), 
  },
  {
    // Guardia que protege la ruta, permitiendo el acceso solo si se cumplen las condiciones.
    canActivateChild: [publicGuard()], 
    path: 'auth',
    // Carga las rutas hijas desde auth.routes de forma asíncrona.
    loadChildren: () => import('./auth/components/auth.routes'), 
  },
  {
    // Guardia privado.
    canActivateChild: [privateGuard()], 
    path: 'user',
    // Carga las rutas hijas desde userpage.routes de forma asíncrona.
    loadChildren: () => import('./user/user.routes'), 
  },
  {
    //  Ruta "comodin" que se utiliza para capturar cualquier ruta que no exista.
    path: '**', 
    // Redirige a la ruta vacía, que a su vez redirige a localhost:4200/home.
    redirectTo: 'home',
  }
];
