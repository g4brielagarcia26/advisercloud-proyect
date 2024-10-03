import { Component, HostListener } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthStateService } from '../../../shared/data-access/auth-state.service';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink,NgClass],
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


// Inicializa la variable isDropdownOpen como false, indicando que el dropdown está cerrado por defecto.
isDropdownOpen = false;

// Método para alternar el estado del dropdown.
toggleDropdown() {
  // Cambia el estado de isDropdownOpen: si está true, lo pone en false y viceversa.
  this.isDropdownOpen = !this.isDropdownOpen;
}

// Escucha eventos de clic en el documento.
@HostListener('document:click', ['$event'])
onClick(event: MouseEvent) {
  // Obtiene el elemento que fue clicado.
  const target = event.target as HTMLElement;

  // Verifica si el elemento clicado está dentro de un contenedor con la clase 'relative'.
  const clickedInside = target.closest('.relative');

  // Si no se clicó dentro del contenedor, cierra el dropdown.
  if (!clickedInside) {
    this.isDropdownOpen = false;
  }
}

}
