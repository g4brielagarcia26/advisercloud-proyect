import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import ToolPanelComponent from "../../tools/tool-panel/tool-panel.component";
import { CommonModule } from '@angular/common';
import { FiltersComponent } from "../filters/filters.component";

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet, CommonModule, SidebarComponent, HeaderComponent, FooterComponent, ToolPanelComponent, FiltersComponent],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css'
})
export default class LayoutComponent {

  // Estado inicial del sidebar.
  isSidebarVisible: boolean = false;
  // Estado inicial de la autenticación.
  isAuthenticated = false;

  // Método para alternar la visibilidad del sidebar
  toggleSidebar() {
    this.isSidebarVisible = !this.isSidebarVisible;
  }

  // Método para actualizar el estado de autenticación recibido desde Header
  onAuthStatusChange(isAuthenticated: boolean) {
    this.isAuthenticated = isAuthenticated;

     // Si el usuario se autentica, mostramos el sidebar automáticamente
     if (this.isAuthenticated) {
      this.isSidebarVisible = true;
    }
  }
}
