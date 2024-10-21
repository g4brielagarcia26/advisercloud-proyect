import { Component, EventEmitter, HostListener, Output, ElementRef } from '@angular/core';
import { NavigationEnd, NavigationError, NavigationStart, Router, RouterLink, RouterOutlet } from '@angular/router';
import { AuthStateService } from '../../../shared/data-access/auth-state.service';
import { NgClass } from '@angular/common';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { User } from '@angular/fire/auth';
import { SearchService } from '../search/search.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterOutlet, RouterLink, NgClass, SidebarComponent],
  templateUrl: './header.component.html',
})
export class HeaderComponent {

  // Emitimos el evento hacia nuestro componente Layout.
  @Output() toggleSidebar: EventEmitter<void> = new EventEmitter<void>();
  // Emitimos el estado de autenticación hacia el componente Layout
  @Output() authStatus: EventEmitter<boolean> = new EventEmitter<boolean>();

  public user: User | null = null;

  /* Estado de autenticación del usuario. Esta propiedad almacena si el usuario está autenticado o no.
  Se actualiza dinámicamente a través del servicio AuthStateService.
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
  constructor(
    private authStateService: AuthStateService,
    private router: Router,
    private elementRef: ElementRef, // Inyectamos ElementRef para acceder al DOM.
    private searchService: SearchService 
  ) {
    // Suscripción al estado de autenticación del servicio.
    this.authStateService.authState$.subscribe((user) => {
      // Actualiza la variable 'isAuthenticated' según la existencia de un usuario autenticado.
      this.isAuthenticated = !!user;
      this.user = user;
      // Emitimos el estado de autenticación cada vez que cambie.
      this.authStatus.emit(this.isAuthenticated);
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

  // Método para manejar eventos de búsqueda en el componente.
  onSearch(event: Event): void {
    // Convierte event.target al tipo HTMLInputElement.
    // Esto permite acceder a las propiedades del elemento de entrada, como value, que contiene el texto ingresado por el usuario.
    const inputElement = event.target as HTMLInputElement;
    
    // Comprueba que inputElement no sea null o undefined y que inputElement.value contenga algún valor. 
    if (inputElement && inputElement.value) {

      // Almacena el valor del campo de entrada en la variable term.
      const term = inputElement.value;
      
      // Llama al método changeSearchTerm del servicio SearchService, pasando el término de búsqueda como argumento. 
      // Esto actualiza el valor del BehaviorSubject en el servicio, lo cual notifica a todos los componentes suscritos que el término de búsqueda ha cambiado.
      this.searchService.changeSearchTerm(term); 
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
