import { Routes } from '@angular/router';
import { publicGuard, privateGuard } from './core/guards/auth.guards';

export const routes: Routes = [
  {
    path: '', // Ruta vacía redirige a home
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'home',
    // Carga las rutas hijas desde auth.routes de forma asíncrona.
    loadChildren: () => import('./home/home.routes'), 
  },
  {
    // Guardia que protege la ruta, permitiendo el acceso solo si se cumplen las condiciones.
    path: 'auth',
    // Carga las rutas hijas desde auth.routes de forma asíncrona.
    loadChildren: () => import('./auth/components/auth.routes'), 
  },
  {
    //  Ruta "comodin" que se utiliza para capturar cualquier ruta que no exista.
    path: '**', 
    // Redirige a la ruta vacía, que a su vez redirige a localhost:4200/home.
    redirectTo: 'home',
  }
];
