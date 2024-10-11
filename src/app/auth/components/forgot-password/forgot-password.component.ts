import { Component, HostListener, inject } from '@angular/core';
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
import { Firestore ,collection,getDocs, query, where } from '@angular/fire/firestore';

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
  private _firestore = inject (Firestore)

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

    try {
    // Referencia a la colección 'users' en Firestore
    const userRef = collection(this._firestore, 'users');
    //consulta donde el campo 'email' es igual al email proporcionado
    const queryUserDoc = await getDocs(query(userRef, where('email','==',email)));
    
    //Verifica si se encontraron documentos.
    if (queryUserDoc.empty) {
      toast.error('Este correo no está registrado');
      return;
    }
    
    //Se obitene el primer documento del resultado de la consulta.
    const userDoc = queryUserDoc.docs[0];
    const userData = userDoc.data();

    // Verifica si el método de autenticación es Google.
    if (userData['authMethod'] === 'google') {
      toast.error('Este usuario fue registrado con Google. No se puede restablecer la contraseña');
      return;
    }
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
  //Escucha el evento de pulsar la tecla enter para enviar el formulario
  @HostListener('document:keydown.enter', ['$event'])
  handleEnterKey(event: KeyboardEvent) {
    event.preventDefault();
    this.submit();
  }
  
}
