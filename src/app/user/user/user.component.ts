import { Component, inject } from '@angular/core';
import { AuthStateService } from '../../shared/data-access/auth-state.service';
import { User as FirebaseUser } from '@angular/fire/auth';
import { CommonModule } from '@angular/common';
import { AuthService, User } from '../../auth/data-access/auth.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  doc,
  Firestore,
  getDoc,
  updateDoc,
} from '@angular/fire/firestore';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './user.component.html',
})
export default class UserComponent {
  private _authService = inject(AuthService);
  private _authState = inject(AuthStateService);
  private _firestore = inject(Firestore);
  private router = inject(Router);

  currentUser: FirebaseUser | null = null; //Interface de Firebase

  userData: User | null = null; //Interface personalizada en auth.service

  // Flag para controlar la visibilidad de la contraseña
  isPasswordVisible = false;
  isEditVisible = false;
  isReauthVisible = false;
  newPassword: string = '';
  reauthEmail = '';
  reauthPassword = '';
  // Definir una variable para almacenar los cambios pendientes
  pendingChanges: Partial<User> = {};
  newEmailValue: string = '';

  profileForm: FormGroup;
  reauthForm: FormGroup;
  isReauthModalVisible = false;  // Para mostrar el modal de reautenticación

  constructor(private fb: FormBuilder, private authService: AuthService) {
    this.loadUserData();

        // Formulario para editar perfil
        this.profileForm = this.fb.group({
          displayName: ['', Validators.required],
          photoURL: [''],
          password: [''],
          newEmail: [''],
        });

            // Formulario para reautenticación
    this.reauthForm = this.fb.group({
      password: ['', Validators.required],
    });
  }

  onSubmit(): void {
    if (this.profileForm.valid) {
      const { displayName, photoURL, password, newEmail } = this.profileForm.value;

      // Si el usuario está intentando cambiar el correo o la contraseña, mostrar el modal de reautenticación
      if (newEmail || password) {
        this.isReauthModalVisible = true;
      } else {
        this.updateProfile({ displayName, photoURL });
      }
    }
  }

  onReauthSubmit(): void {
    if (this.reauthForm.valid) {
      const password = this.reauthForm.get('password')?.value;

      this.authService.reauthenticateWithCredential(password)
        .then(() => {
          const { displayName, photoURL, newEmail } = this.profileForm.value;
          
          this.updateProfile({
            displayName,
            photoURL,
            newEmail,
          });
          this.isReauthModalVisible = false;
        })
        .catch(error => {
          console.error('Error en la reautenticación', error);
        });
    }
  }

  private updateProfile(updatedData: { displayName?: string; photoURL?: string; newEmail?: string }): void {
    // Llamar al servicio de autenticación para actualizar Firebase Auth
    this.authService.updateProfile(updatedData).then(() => {
      if (updatedData.newEmail) {
        this.authService.verifyBeforeUpdateEmail(updatedData.newEmail);
      }
      console.log('Perfil actualizado correctamente');
    }).catch(error => {
      console.error('Error al actualizar perfil', error);
    });
  }

  

  async loadUserData() {
    this._authState.authState$.subscribe((user) => {
      if (user) {
        console.log('UID del usuario: ', user.uid);
        this.currentUser = user;

        this._authService.getUserData(user.uid).subscribe((userData) => {
          if (userData) {
            this.userData = userData;
            console.log('Datos del usuario: ', this.userData);
          } else {
            console.error('No se encontraron datos de usuario');
          }
        });
      }
    });
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

  async updateUserProfile(
    displayName?: string,
    photoURL?: string,
    currentPassword?: string,
    newEmail?: string
  ) {
    // Almacenar los cambios en la variable pendingChanges
    if (displayName) {
      this.pendingChanges.displayName = displayName;
    }
    if (photoURL) {
      this.pendingChanges.photoURL = photoURL;
    }
    if (currentPassword) {
      this.pendingChanges.password = currentPassword;
    }
    if (newEmail && newEmail !== this.userData?.email) {
      this.pendingChanges.email = newEmail;
    }
    // Mostrar el formulario de reautenticación
    if (Object.keys(this.pendingChanges).length > 0) {
      this.toggleReauth();
      this.isEditVisible = false;
    }
  }

  // Método para reautenticar al usuario
  async reauthenticate() {
    try {
      // Validar campos requeridos
      if (!this.reauthEmail || !this.reauthPassword) {
        throw new Error('Por favor, completa todos los campos.');
      }

      console.log(
        'Estado actual de currentUser antes de la reautenticación: ',
        this.currentUser
      );
      if (!this.currentUser) {
        throw new Error('No hay usuario autenticado');
      }

      // Reautenticar al usuario
      await this._authService.reauthenticateWithCredential(this.reauthPassword);

      const updatePromises = [];

      // Verificar existencia del documento en Firestore // CAMBIO:
      const userDocRef = doc(this._firestore, `users/${this.currentUser.uid}`);
      const userDocSnapshot = await getDoc(userDocRef);
      if (!userDocSnapshot.exists()) {
        throw new Error('El documento del usuario no existe en Firestore.');
      }
      console.log(
        'Documento Firestore encontrado, continuando con la actualización.'
      );

      // Actualizar correo electrónico
      if (
        this.pendingChanges.email &&
        this.pendingChanges.email !== this.userData?.email
      ) {
        await this._authService.verifyBeforeUpdateEmail(
          this.pendingChanges.email
        );
        console.log('Correo de verificación enviado');
        alert(
          'Tu correo ha sido actualizado. Por favor, verifica tu nuevo correo y vuelve a iniciar sesión.'
        );
        await this._authState.logOut();
        this.router.navigate(['/login']);
        return;
      }
      //else {
      //   console.log('Correo de verificación no enviado');
      //   console.log('Pending email:', this.pendingChanges.email);
      //   console.log('Current email:', this.userData?.email);
      // }

      // Actualizar perfil
      if (this.pendingChanges.displayName || this.pendingChanges.photoURL) {
        updatePromises.push(
          this._authService.updateProfile({
            displayName: this.pendingChanges.displayName,
            photoURL: this.pendingChanges.photoURL,
          })
        );
      }
      // Preparar datos actualizados para Firestore
      const updatedUserData = {
        displayName:
          this.pendingChanges.displayName || this.userData?.displayName,
        photoURL: this.pendingChanges.photoURL || this.userData?.photoURL,
        email: this.pendingChanges.email || this.userData?.email,
      };
      console.log('Datos a actualizar en Firestore:', updatedUserData);
      // Actualizar Firestore
      //const userDocRef = doc(this._firestore, `users/${this.currentUser.uid}`);

      updatePromises.push(updateDoc(userDocRef, updatedUserData));

      await Promise.all(updatePromises);

      console.log('Perfil de usuario actualizado y perfil completada');
      //await this.loadUserData();
      this.cancelReauth();

      // Limpiar los cambios pendientes
      this.pendingChanges = {};
    } catch (error) {
      console.error('Error en la reautenticación:', error);
    }
  }

  // Cancela la reautenticación y vuelve al perfil
  cancelReauth() {
    this.isReauthVisible = false;
    this.isEditVisible = false;
    // Reinicia el formulario de reautenticación
    this.reauthEmail = '';
    this.reauthPassword = '';
  }

  // Método para alternar la visibilidad de la contraseña.
  showPassword() {
    this.isPasswordVisible = !this.isPasswordVisible;
  }

  toggleReauth() {
    this.isReauthVisible = !this.isReauthVisible;
  }

  toggleReauthModal() {
    this.isReauthModalVisible = true;
  }


  
}
