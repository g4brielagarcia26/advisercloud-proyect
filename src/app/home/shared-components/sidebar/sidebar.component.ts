import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink,NgClass],
  templateUrl: './sidebar.component.html'
})
export class SidebarComponent {
}
