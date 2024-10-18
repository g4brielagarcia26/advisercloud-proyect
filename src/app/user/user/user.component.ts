import { Component, inject } from '@angular/core';
import { HeaderComponent } from '../../home/shared-components/header/header.component';
import { AuthStateService } from '../../shared/data-access/auth-state.service';
import { firstValueFrom, Observable, of } from 'rxjs';
import { User as FirebaseUser } from '@angular/fire/auth';
import { CommonModule } from '@angular/common';
import { AuthService, User } from '../../auth/data-access/auth.service';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [CommonModule,HeaderComponent],
  templateUrl: './user.component.html'
})
export default class UserComponent {
_authService = inject(AuthService);
user$: Observable<FirebaseUser | null> = of(null); //Interface proporcionada desde @angular/fire/auth
userData: User | null = null; //Interface personalizada en auth.service

constructor(private _authState:AuthStateService){
  this.loadUserData();
}

async loadUserData(){
  this.user$ = this._authState.authState$;
  try {
    const user = await firstValueFrom(this.user$);
    if (user ) {
      console.log('UID del usuario: ',user.uid);
      
      this.userData = await this._authService.getUserData(user.uid);
      console.log('Datos del usuario: ', this.userData);
      
    }
  } catch (error) {
    console.error('Error al obtener los datos del usuario:', error);
  }
}
}
