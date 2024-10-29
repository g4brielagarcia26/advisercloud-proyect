import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgClass } from '@angular/common';
import { AuthStateService } from '../../../shared/data-access/auth-state.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink,NgClass],
  templateUrl: './sidebar.component.html'
})
export class SidebarComponent {

  // Flag que controla la visibilidad del dropdown "Más opciones"
  isDropdownVisible: boolean = false;

  // Variable para almacenar si el usuario es administrador o no
  isAdmin: boolean = false; 

  constructor( 
    private authStateService: AuthStateService
  ) {}

  ngOnInit(): void {
    // Llama a verifyAdminRole para verificar si el usuario es administrador
    this.authStateService.verifyAdminRole().subscribe(isAdmin => {
      this.isAdmin = isAdmin;
      // console.log("isAdmin:" + this.isAdmin);
    });
  }

  // Función que alterna el estado del flag.
  openSidebarDropdown () {
    this.isDropdownVisible = !this.isDropdownVisible;
  }
}