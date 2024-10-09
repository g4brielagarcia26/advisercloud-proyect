import { Component, inject } from '@angular/core';
import {
  ReactiveFormsModule,
  FormControl,
  FormBuilder,
  Validators,
} from '@angular/forms';
import { isRequired, hasEmailError } from '../../utils/validators/validators';
import { AuthService } from '../../data-access/auth.service';
import { RouterLink } from '@angular/router';
import { toast } from 'ngx-sonner';
import { Firestore ,doc, getDoc } from '@angular/fire/firestore';

interface FormResetPassword {
  email: FormControl<string | null>;
}

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './forgot-password.component.html',
})
export default class ForgotPasswordComponent {
  private _formBuilder = inject(FormBuilder);
  private _authService = inject(AuthService);

  // Definición del formulario reactivo con el campo 'email'.
  form = this._formBuilder.group<FormResetPassword>({
    email: this._formBuilder.control('', [
      Validators.required, // El campo no puede estar vacío.
      Validators.email, // Formato de correo@correo.com
    ]),
  });

  isRequired(field: 'email') {
    return isRequired(field, this.form); // Función externa que verifica si el campo es requerido.
  }

  // Método para verificar si hay un error en el campo de correo electrónico
  hasEmailError() {
    return hasEmailError(this.form); // Llama a la función hasEmailError de utilidades
  }

  // Método para manejar el restablecer contraseña
  async submit() {
    // Extrae el email del formulario.
    const email = this.form.value.email;

    // Verifica que los campos no sean nulos
    if (!email){
      toast.error('Por favor, completa el email correctamente.');
      return;
    }

    // Verifica si el usuario existe en la base de datos de Firestore
    const userExists = await this._authService.checkUserExists(email);

    if (!userExists) {
      toast.error('El email no está registrado');
      return;
    }
    try {
    // Obtener el documento del usuario desde Firestore usando el email
    // const userDocRef = doc(this._firestore, `users/${email}`);
    // const userDoc = await getDoc(userDocRef);

    // if (!userDoc.exists()) {
    //   toast.error('Este correo no está registrado');
    //   return;
    // }

    // const userData = userDoc.data();

    // if (userData['authMethod'] === 'google') {
    //   toast.error('Este usuario está registrado con Google. No se puede restablecer la contraseña');
    //   return;
    // }
      //Llamada al método para restablecer la contraseña
      await this._authService.sendPasswordResetEmail(email);
      toast.success(
        'Correo para restablecer la contraseña enviado. Por favor revise su bandeja de entrada.'
      );
    } catch (error) {
      toast.error(
        (error as Error).message || 'Ocurrió un error al enviar el correo.'
      );
    }
  }
  private _firestore = inject (Firestore)
}
