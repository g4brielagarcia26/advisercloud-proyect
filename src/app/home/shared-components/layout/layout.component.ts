import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import ToolPanelComponent from "../../tools/tool-panel/tool-panel.component";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet, CommonModule, SidebarComponent, HeaderComponent, FooterComponent, ToolPanelComponent],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css'
})
export default class LayoutComponent {

  // Estado inicial del sidebar.
  isSidebarVisible: boolean = true;

  // Método para alternar la visibilidad del sidebar
  toggleSidebar() {
    this.isSidebarVisible = !this.isSidebarVisible;
  }
}
