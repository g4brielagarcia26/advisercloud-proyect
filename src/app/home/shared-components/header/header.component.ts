import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthStateService } from '../../../shared/data-access/auth-state.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
/**
   * Estado de autenticación del usuario.
   * 
   * Esta propiedad almacena si el usuario está autenticado o no.
   * Se actualiza dinámicamente a través del servicio AuthStateService.
   */
isAuthenticated = false;

/**
 * Constructor del componente.
 * 
 * @param authStateService - Servicio de estado de autenticación que permite obtener y gestionar el estado actual del usuario autenticado.
 * @param router - Servicio de enrutador de Angular que permite la navegación programática entre rutas.
 */
constructor(private authStateService: AuthStateService, private router: Router) {
  // Suscripción al estado de autenticación del servicio.
  this.authStateService.authState$.subscribe((user) => {
    this.isAuthenticated = !!user; // Actualiza la variable 'isAuthenticated' según la existencia de un usuario autenticado.
  });
}

/**
 * Método para cerrar sesión.
 * 
 * Este método llama al servicio de autenticación para cerrar la sesión
 * y luego redirige al usuario a la página de inicio de sesión.
 * Si ocurre un error durante el proceso, se captura y se muestra en la consola.
 */
userLogOut() {
  this.authStateService.logOut().then(() => {
    this.router.navigateByUrl('/auth/sign-in'); // Navega a la página de inicio de sesión después de cerrar sesión.
  }).catch((error) => {
    console.error("Error al cerrar sesión:", error); // Maneja errores en la consola si ocurre alguno.
  });
}
}
