import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';
import { AuthStateService } from '../../shared/data-access/auth-state.service';
import { catchError, first, map, of } from 'rxjs';

/**
 * Guard que verifica si el usuario está autenticado.
 * Si el usuario no está autenticado, redirige a la página de inicio.
 *
 * @returns Función que se puede utilizar como guard para rutas.
 */
export const privateGuard = (): CanActivateFn => {
  return (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
    const router = inject(Router); // Inyecta el servicio Router para redirigir.
    const authState = inject(AuthStateService); // Inyecta el servicio de estado de autenticación.

    console.log('Activando privateGuard...');

    // Escucha el estado de autenticación y mapea el resultado.
    return authState.check().pipe(
      map((user) => {
        console.log('Estado en privateGuard', user); // Muestra el estado de autenticación en la consola.
        const targetUrl = state.url;
        if (!user) {
          console.log(
            'No hay usuario autenticado, redirigiendo a /home/tool-panel'
          );
          router.navigateByUrl('/home/tool-panel');
          return false;
        }
        if (user && !user.emailVerified) {
          console.log(
            'Usuario autenticado pero no verificado, permitiendo acceso a /auth/send-email'
          );
          if (targetUrl === '/auth/send-email') {
            return true;
          }
          return true;
        }
        if (user && user.emailVerified) {
          console.log(
            'Usuario autenticado y verificado, redirigiendo a /home/tool-panel'
          );
          if (
            targetUrl === '/auth/send-email' ||
            targetUrl === '/auth/forgot-password'
          ) {
            router.navigateByUrl('/home/tool-panel');
            return false;
          }
        }
        return true; // Permite el acceso a la ruta.
      }),
      catchError(() => {
        router.navigateByUrl('/home/tool-panel');
        return of(false);
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
  return (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
    // Devuelve un observable que emite un booleano
    const router = inject(Router);
    const authState = inject(AuthStateService);

    // Llama al método para forzar la actualización del estado del usuario
    //authState.reloadUser();
    console.log('Activando publicGuard...');
    return authState.check().pipe(
      first(),
      map((user) => {
        console.log('Estado actualizado en publicGuard:', user);
        const targetUrl = state.url;
        if (!user) {
          console.log('No hay usuario, permitiendo acceso a: ', targetUrl);
          return true;
        }
        if (user && !user.emailVerified) {
          console.log(
            'Usuario autenticado pero no verificado, permitiendo acceso a /auth/log-in y /auth/send-email'
          );
          if (targetUrl === '/auth/log-in') {
            return true;
          }
          return true;
        }
        if (user && user.emailVerified) {
          console.log(
            'Usuario autenticado y verificado, redirigiendo a /home/tool-panel'
          );
          if (
            targetUrl === '/auth/log-in' ||
            targetUrl === '/auth/sign-up'
          ) {
            router.navigateByUrl('/home/tool-panel');
            return false;
          }
        }
        return false;
      }),
      catchError(() => of(false))
    );
  };
};

// :)
