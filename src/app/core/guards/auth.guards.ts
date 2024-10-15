import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { AuthStateService } from '../../shared/data-access/auth-state.service';
import { map, Observable } from 'rxjs';

/**
 * Guard que verifica si el usuario está autenticado.
 * Si el usuario no está autenticado, redirige a la página de inicio.
 *
 * @returns Función que se puede utilizar como guard para rutas.
 */
export const privateGuard = (): CanActivateFn => {
  return () => {
    const router = inject(Router); // Inyecta el servicio Router para redirigir.
    const authState = inject(AuthStateService); // Inyecta el servicio de estado de autenticación.

    // Fuerza la actualización del estado del usuario
    authState.reloadUser();

    // Escucha el estado de autenticación y mapea el resultado.
    return authState.authState$.pipe(
      map((state) => {
        console.log('Estado en privateGuard', state); // Muestra el estado de autenticación en la consola.
        // Si el estado es falso (no autenticado), redirige a la página de inicio.
        if (!state) {
          router.navigateByUrl('/home/tool-panel');
          return false; // Bloquea el acceso a la ruta privada.
        }
        if (!state.emailVerified) {
          router.navigateByUrl('/home/tool-panel');
          return false;
        }
        return true; // Permite el acceso a la ruta.
      })
    );
  };
};

/**
 * Guard que verifica si el usuario no está autenticado.
 * Si el usuario ya está autenticado, redirige a la página del usuario.
 *
 * @returns Función que se puede utilizar como guard para rutas.
 */

export const publicGuard = (): CanActivateFn => {
  return (
    route: ActivatedRouteSnapshot, // Información sobre la ruta activada.
    state: RouterStateSnapshot // Estado de la navegación en este momento.
  ): Observable<boolean> => {
    // Devuelve un observable que emite un booleano
    const router = inject(Router);
    const authState = inject(AuthStateService);

    // Llama al método para forzar la actualización del estado del usuario
    authState.reloadUser();

    // Escucha el estado de autenticación y mapea el resultado.
    return authState.authState$.pipe(
      map((user) => {
        console.log('Estado en publicGuard', user);
        // Guarda la URL de destino a la que se quiere acceder.
        const targetUrl = state.url;

        if (!user) {
          console.log('No hay usuario, permitiendo acceso');
          return true;
          
        }

        // Si hay un usuario autenticado e intenta acceder a '/auth/log-in' sin verificar el correo.
        if (user && targetUrl === '/auth/log-in' && !user.emailVerified) {
          console.log('Usuario autenticado pero no verificado, permitiendo acceso a /auth/log-in');
          return true; // Permite el acceso a la ruta de inicio de sesión.
        }
        // Si hay un usuario autenticado y su correo está verificado, redirige a la página principal.
        if (user.emailVerified) {
          if (
            targetUrl === '/auth/log-in' ||
            targetUrl === '/auth/sign-up' ||
            targetUrl === '/auth/send-email' ||
            targetUrl === '/auth/forgot-password'
          ) {
            console.log('Redirigiendo a /home/tool-panel');
            router.navigateByUrl('/home/tool-panel');
            return false;
          }
        }
        return true;
      })
    );
  };
};

// :)
