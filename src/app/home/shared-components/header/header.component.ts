import { Component, EventEmitter, HostListener, inject, Output } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { AuthStateService } from '../../../shared/data-access/auth-state.service';
import { NgClass } from '@angular/common';
import { SidebarComponent } from "../sidebar/sidebar.component";


@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterOutlet, RouterLink, NgClass, SidebarComponent],
  templateUrl: './header.component.html'
})
export class HeaderComponent {
  // Emitimos el evento hacia nuestro componente Layout.
  @Output() toggleSidebar: EventEmitter<void> = new EventEmitter<void>();

  /**
     * Estado de autenticación del usuario.
     * Esta propiedad almacena si el usuario está autenticado o no.
     * Se actualiza dinámicamente a través del servicio AuthStateService.
    */
  isAuthenticated = false;
  // Inicializa la variable isDropdownUserOpen como false, indicando que el dropdown del usuario está cerrado por defecto.
  isDropdownUserOpen = false;

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

  // Acción al hacer clic en el botón del usuario
  handleUserAction(): void {
    if (this.isAuthenticated) {
      // Si está autenticado, se abre el dropdown
      this.toggleUserDropdown();
    } else {
      // Si no está autenticado, redirigir a la ruta de inicio de sesión
      this.router.navigate(['/auth/log-in']);
    }
  }

  // Método para alternar el estado del dropdown en la parte del usuario.
  toggleUserDropdown() {
    // Cambia el estado de isDropdownUserOpen: si está true, lo pone en false y viceversa.
    this.isDropdownUserOpen = !this.isDropdownUserOpen;
  }

  // Método para emitir el evento y que el sidebar pueda cerrarse.
  onToggleSidebar() {
    this.toggleSidebar.emit(); // Emitimos el evento para notificar al layout
  }
} // :)
