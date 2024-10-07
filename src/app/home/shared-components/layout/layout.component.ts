import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { HomeService } from '../../services/home.service';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet,SidebarComponent,HeaderComponent,FooterComponent],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css'
})
export default class LayoutComponent {
  Dropdown = inject(HomeService)
}
