import {
  Component,
  EventEmitter,
  HostListener,
  Output,
  ElementRef,
  inject,
} from '@angular/core';
import { NavigationEnd, NavigationError, NavigationStart, Router, RouterLink, RouterOutlet } from '@angular/router';
import { AuthStateService } from '../../../shared/data-access/auth-state.service';
import { CommonModule, NgClass } from '@angular/common';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { User } from '@angular/fire/auth';
import { AuthService } from '../../../auth/data-access/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule ,RouterOutlet, RouterLink, NgClass, SidebarComponent],
  templateUrl: './header.component.html',
})
export class HeaderComponent {
  _authService = inject (AuthService);
  // Emitimos el evento hacia nuestro componente Layout.
  @Output() toggleSidebar: EventEmitter<void> = new EventEmitter<void>();
  // Emitimos el estado de autenticación hacia el componente Layout
  @Output() authStatus: EventEmitter<boolean> = new EventEmitter<boolean>();

  public user: User | null = null;

  /**
   * Estado de autenticación del usuario.
   * Esta propiedad almacena si el usuario está autenticado o no.
   * Se actualiza dinámicamente a través del servicio AuthStateService.
   */
  isAuthenticated = false;
  // Inicializa la variable isDropdownUserOpen como false, indicando que el dropdown del usuario está cerrado por defecto.
  isDropdownUserOpen = false;

  userInitial: string | null = null;

  /**
   * Constructor del componente.
   *
   * @param authStateService - Servicio de estado de autenticación que permite obtener y gestionar el estado actual del usuario autenticado.
   * @param router - Servicio de enrutador de Angular que permite la navegación programática entre rutas.
   */
  constructor(
    private authStateService: AuthStateService,
    private router: Router,
    private elementRef: ElementRef // Inyectamos ElementRef para acceder al DOM.
  ) {
    // Suscripción al estado de autenticación del servicio.
    this.authStateService.authState$.subscribe((user) => {
      // Actualiza la variable 'isAuthenticated' según la existencia de un usuario autenticado.
      this.isAuthenticated = !!user;
      this.user = user;
      // Emitimos el estado de autenticación cada vez que cambie.
      this.authStatus.emit(this.isAuthenticated);

      if ( this.isAuthenticated && this.user?.emailVerified){
        this.loadUserInitial();
      }
    });
  }

  ngOnInit() {
    //Eventos de navegación del router
    this.router.events.subscribe((event) => {
      //Inicio de navegación, muestra la url a la que se está navegando
      if (event instanceof NavigationStart) {
        console.log('Navegación iniciada hacia:', event.url);
      }
      //Muestra la url final
      if (event instanceof NavigationEnd) {
        console.log('Navegación finalizada hacia:', event.url);
      }
      //Muestra la url donde se produce el error
      if (event instanceof NavigationError) {
        console.log('Error en la navegación hacia:', event.url);
      }
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
    this.authStateService
      .logOut()
      .then(() => {
        this.router.navigateByUrl('/auth/sign-in'); // Navega a la página de inicio de sesión después de cerrar sesión.
      })
      .catch((error) => {
        console.error('Error al cerrar sesión:', error); // Maneja errores en la consola si ocurre alguno.
      });
  }

/**
 * Carga las iniciales del usuario autenticado.
 * Este método obtiene los datos del usuario autenticado desde el servicio AuthService
 * y establece la inicial del usuario en la variable userInitial.
 */
  loadUserInitial() {
    if (this.user) {
      this._authService.getUserData(this.user.uid).then((userData) => {
        if (userData) {
          this.userInitial = userData.initial || '';
        }
      });
    }
  }

  // Método para emitir el evento y que el sidebar pueda cerrarse.
  onToggleSidebar() {
    this.toggleSidebar.emit(); // Emitimos el evento para notificar al layout
  }

  // Acción al hacer clic en el botón del usuario
  handleUserAction(): void {
    console.log('handleUserAction llamado');
    console.log('isAuthenticated: ', this.isAuthenticated); // Verifica el estado de autenticación

    console.log('user:', this.user); // Verifica que 'user' no sea null
    console.log('emailVerified: ', this.user?.emailVerified); // Verifica si el email está verificado
    
    if (!this.isAuthenticated) {
      console.log(
        'Redirigiendo a /auth/log-in porque el usuario no está autenticado'
      );
      this.router.navigate(['/auth/log-in']);
    } else if (this.user && !this.user.emailVerified) {
      console.log(
        'Redirigiendo a /auth/log-in porque el correo no está verificado'
      );
      this.router.navigate(['/auth/log-in']);
    } else {
      this.toggleUserDropdown();
    }
  }

  // Método para alternar el estado del dropdown en la parte del usuario.
  toggleUserDropdown() {
    // Cambia el estado de isDropdownUserOpen: si está true, lo pone en false y viceversa.
    this.isDropdownUserOpen = !this.isDropdownUserOpen;
  }

  /**
   * @HostListener para detectar clics fuera del menú desplegable
   *
   * Escucha cualquier clic en el documento y verifica si el clic ocurrió fuera del
   * dropdown del usuario. Si es así, cierra el dropdown.
   */
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    const clickedInside = this.elementRef.nativeElement.contains(event.target);
    if (!clickedInside && this.isDropdownUserOpen) {
      this.isDropdownUserOpen = false; // Cierra el menú desplegable si el clic fue fuera del componente
    }
  }
} // :)
