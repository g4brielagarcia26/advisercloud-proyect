import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import ToolPanelComponent from '../../tools/tool-panel/tool-panel.component';
import { CommonModule } from '@angular/common';
import { FiltersComponent } from '../filters/filters.component';
import { AuthStateService } from '../../../shared/data-access/auth-state.service';
import { User } from '@angular/fire/auth';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    RouterOutlet,
    CommonModule,
    SidebarComponent,
    HeaderComponent,
    FooterComponent,
    ToolPanelComponent,
    FiltersComponent,
  ],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css',
})
export default class LayoutComponent {
  private _authState = inject(AuthStateService);
  private authSubscription: Subscription | null = null;
  public user: User | null = null;
  // Estado inicial del sidebar.
  isSidebarVisible: boolean = false;
  // Estado inicial de la autenticación.
  isAuthenticated = false;

  constructor() {
    // Suscripción al observable de estado de autenticación para obtener el usuario actualizado.
    this.authSubscription = this._authState.authState$.subscribe(
      (user: User | null) => {
        // Se guarda el usuario autenticado (o null si no hay ningún usuario autenticado).
        this.user = user;
        this.isAuthenticated = !!user;
        // Se actualiza la visibilidad del sidebar solo si el usuario está autenticado y su email está verificado.
        this.updateSidebarVisibility();
      }
    );
  }
/**
 * @ngDestroy
 * Comprueba si existe una suscripción de autenticación
 * Si existe, cancela la suscripción para evitar pérdidas de memoria
 */
  ngOnDestroy() {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }
  // Método para actualizar la visibilidad del sidebar
  private updateSidebarVisibility() {
    this.isSidebarVisible =
      this.isAuthenticated && this.user?.emailVerified === true;
  }

  // Método para alternar la visibilidad del sidebar
  toggleSidebar() {
    this.isSidebarVisible = !this.isSidebarVisible;
  }

  // Método para actualizar el estado de autenticación recibido desde Header
  onAuthStatusChange(isAuthenticated: boolean) {
    // Actualiza el estado de autenticación (verdadero o falso).
    this.isAuthenticated = isAuthenticated;
    this.updateSidebarVisibility();
  }
}
