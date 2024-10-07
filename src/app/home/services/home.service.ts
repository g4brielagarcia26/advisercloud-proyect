import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class HomeService {
  constructor() {}



  // Inicializa la variable isDropdownUserOpen como true, indicando que el dropdown del SideBar está cerrado por defecto.
  isDropdownSideOpen = false;

  // Método para alternar el estado del dropdown.
  toggleSideDropdown() {
      // Cambia el estado de isDropdownSideOpen: si está true, lo pone en false y viceversa.
    this.isDropdownSideOpen = !this.isDropdownSideOpen;
  }
}
