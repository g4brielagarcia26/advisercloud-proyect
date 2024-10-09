import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthStateService } from '../../shared/data-access/auth-state.service';
import { map } from 'rxjs';

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

    // Escucha el estado de autenticación y mapea el resultado.
    return authState.authState$.pipe(
      map((state) => {
        console.log(state); // Muestra el estado de autenticación en la consola.
        // Si el estado es falso (no autenticado), redirige a la página de inicio.
        if (!state) {
          router.navigateByUrl('/home');
          return false; // Bloquea el acceso a la ruta privada.
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
  return () => {
    const router = inject(Router); // Inyecta el servicio Router para redirigir.
    const authState = inject(AuthStateService); // Inyecta el servicio de estado de autenticación.

    // Escucha el estado de autenticación y mapea el resultado.
    return authState.authState$.pipe(
      map((state) => {
      // Si el estado es verdadero (autenticado)
      // Si el usuario está autenticado y ha verificado su correo
        if (state) {
          router.navigateByUrl('/home');
          return false; // Bloquea el acceso a la ruta pública.
        }
        return true; // Permite el acceso a la ruta.
      })
    );
  };
};

// :)
