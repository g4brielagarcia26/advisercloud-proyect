import { Component, inject } from '@angular/core';
import { HeaderComponent } from '../../home/shared-components/header/header.component';
import { AuthStateService } from '../../shared/data-access/auth-state.service';
import { Observable, of } from 'rxjs';
import { User } from '@angular/fire/auth';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [CommonModule,HeaderComponent],
  templateUrl: './user.component.html'
})
export default class UserComponent {
// _authState = inject(AuthStateService);
user$: Observable<User | null> = of(null);

constructor(private _authState:AuthStateService){
  this.userData();
}

async userData(){
  this.user$ = this._authState.authState$;
}
}
