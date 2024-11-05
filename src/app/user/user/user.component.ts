import { Component, inject } from '@angular/core';
import { HeaderComponent } from '../../home/shared-components/header/header.component';
import { AuthStateService } from '../../shared/data-access/auth-state.service';
import { firstValueFrom, Observable, of } from 'rxjs';
import { User as FirebaseUser } from '@angular/fire/auth';
import { CommonModule } from '@angular/common';
import { AuthService, User } from '../../auth/data-access/auth.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [CommonModule, HeaderComponent, FormsModule],
  templateUrl: './user.component.html',
})
export default class UserComponent {
  private _authService = inject(AuthService);
  private _authState = inject(AuthStateService);
  user$: Observable<FirebaseUser | null> = of(null); //Interface proporcionada desde @angular/fire/auth
  //userData: User | null = null; //Interface personalizada en auth.service

  userData: User = {
    firstName: '',
    lastName: '',
    displayName: '',
    email: '',
    password: '',
    authMethod: '',
    photoURL: '',
    initial: '',
    roles: {
      admin: false,
      cliente: false,
    },
  };
  // Flag para controlar la visibilidad de la contraseña
  isPasswordVisible = false;
  isEditVisible = false;
  isReauthVisible = false;
  newPassword: string = '';
  reauthEmail = '';
  reauthPassword = '';

  constructor() {
    this.loadUserData();
  }

  async loadUserData() {
    this.user$ = this._authState.authState$;
    try {
      const user = await firstValueFrom(this.user$);
      if (user) {
        console.log('UID del usuario: ', user.uid);
        const userData = await this._authService.getUserData(user.uid);

        if (userData) {
          this.userData = userData;
          if (this.userData.displayName) {
            this.userData.initial = this._authService.getInitial(
              this.userData.displayName
            );
          }
          console.log('Datos del usuario: ', this.userData);
        }
      }
    } catch (error) {
      console.error('Error al obtener los datos del usuario:', error);
    }
  }

  toggleEditProfile() {
    this.isEditVisible = !this.isEditVisible;
  }

  onPhotoSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      // Lógica para subir la foto o actualizar la URL de la foto en la base de datos
    }
  }
  async updateProfile() {
    try {
      await this._authService.updateProfile({
        displayName: this.userData.displayName,
        photoURL: this.userData.photoURL,
        email: this.userData.email,
      });
      this.isEditVisible = false; //Ocultar el formulario despúes de guardar
      this.isReauthVisible = true; // Muestra el formulario de reautenticación
    } catch (error) {
      console.error('Error al actualizar el perfil:', error);
    }
  }

  // Método para reautenticar al usuario
  async reauthenticate() {
    try {
      await this._authService.reauthenticateWithCredential(
        this.reauthEmail,
        this.reauthPassword
      );
      this.isReauthVisible = false;
    } catch (error) {
      console.error('Error al reautenticar al usuario:', error);
    }
  }

  // Cancela la reautenticación y vuelve al perfil
  cancelReauth() {
    this.isReauthVisible = false;
    // Reinicia el formulario de reautenticación
    this.reauthEmail = '';
    this.reauthPassword = '';
  }
  async sendVerificationEmail() {
    // Asegúrate de obtener el valor de email correctamente
    try {
      const email = this.userData.email;
      if (email) {
        await this._authService.sendVerificationEmail(email);
        alert(
          'Correo de verificación enviado. Por favor verifica tu correo electrónico.'
        );
      } else {
        alert('Por favor, ingresa un correo electrónico válido.');
      }
    } catch (error) {
      console.error('Error al enviar el correo de verificación:', error);
    }
  }

  // Método para alternar la visibilidad de la contraseña.
  showPassword() {
    this.isPasswordVisible = !this.isPasswordVisible;
  }
}
