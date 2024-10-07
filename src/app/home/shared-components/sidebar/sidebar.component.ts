import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HomeService } from '../../services/home.service';
import { NgClass } from '@angular/common';



@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink,NgClass],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
  Dropdown = inject(HomeService)
}
