import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthStateService } from '../../../shared/data-access/auth-state.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
  // private authState = inject(AuthStateService);
  // private router = inject(Router);
  
  // async logOut(){
  
  //   try {
  //     await this.authState.logOut();
  //     this.router.navigate(['/auth']);
  //   } catch (error) {
  //     console.log(error);
      
  //   }
  // }
}
