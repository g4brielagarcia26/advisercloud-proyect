import { Component, Inject, inject } from '@angular/core';
import { Router, RouterOutlet, RouterLink} from '@angular/router';
import { AuthStateService } from './shared/data-access/auth-state.service';
import { NgxSonnerToaster } from 'ngx-sonner';
import ToolPanelComponent from "./home/tools/tool-panel/tool-panel.component";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NgxSonnerToaster, RouterLink, ToolPanelComponent, CommonModule],
  templateUrl: './app.component.html'
})
export class AppComponent {
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