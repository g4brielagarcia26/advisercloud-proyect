import { Component, inject } from '@angular/core';
import { FormBuilder, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../data-access/auth.service';
import { Router, RouterLink } from '@angular/router';
import { toast } from 'ngx-sonner';
import { isRequired, hasEmailError, hasPasswordError } from '../../utils/validators/validators';
import { GoogleButtonComponent } from '../google-button/google-button.component';
import { CommonModule } from '@angular/common';

// Definimos la estructura de los datos.
interface FormSignUp {
  firstName: FormControl<string | null>;
  lastName: FormControl<string | null>;
  email: FormControl<string | null>;
  password: FormControl<string | null>;
}

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, GoogleButtonComponent, RouterLink],
  templateUrl: './sign-up.component.html',
  styles: ``
})
export default class SignUpComponent {

  // Inyección de dependencias para utilizar los servicios necesarios.
  private _formBuilder = inject(FormBuilder);
  private _authService = inject(AuthService);
  private _router = inject(Router);

  // Flag para controlar la visibilidad de la contraseña.
  isPasswordVisible = false;

  // Flag para controlar si el usuario ha intentado enviar el formulario.
  attemptedSubmit = false;

  // Definición del formulario reactivo con validaciones
  form = this._formBuilder.group<FormSignUp>({
    firstName: this._formBuilder.control('', Validators.required),
    lastName: this._formBuilder.control('', Validators.required),
    email: this._formBuilder.control(
      '',
      [
        Validators.required, // El campo no puede estar vacío.
        Validators.email // Formato de correo@correo.com
      ]),
    password: this._formBuilder.control(
      '',
      [
        Validators.required,
        Validators.minLength(12), // Longitud mínima de 12 caracteres.
        Validators.pattern('^(?=.*[A-Z])(?=.*[a-z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{12,}$')
      ]),
  });

  // Método para verificar si un campo es requerido
  isRequired(field: 'firstName' | 'lastName' | 'email' | 'password') {
    return isRequired(field, this.form); // Llama a la función isRequired de utilidades
  }

  // Método para verificar si hay un error en el campo de correo electrónico
  hasEmailError() {
    return hasEmailError(this.form); // Llama a la función hasEmailError de utilidades
  }

  // Método para verificar el patrón y la longitud de la contraseña
  validatePassword() {
    return hasPasswordError(this.form, this.attemptedSubmit);
  }

  // Método para manejar el envío del formulario
  async submit() {

    // Marca que se ha intentado enviar el formulario
    // El flag cambia a true una vez que entra en el método submit.
    this.attemptedSubmit = true;

    // Verifica si el formulario es válido
    if (this.form.invalid) {
      toast.error('Por favor, completa todos los campos correctamente.'); // Mensaje de error si hay campos inválidos
      return;
    }

    // Desestructura los valores del formulario
    const { firstName, lastName, email, password } = this.form.value;

    // Verifica que los campos no sean nulos
    if (!email || !password || !firstName || !lastName) return;

    // Verifica si el usuario existe en la base de datos de Firestore
    const userExists = await this._authService.checkUserExists(email);

    if (userExists) {
      toast.error('El usuario ya existe. Por favor, inicia sesión.');
      return;
    }

    try {
      // Intenta registrar al usuario utilizando el servicio de autenticación
      await this._authService.signUp({ firstName, lastName, email, password });
      toast.success('Usuario creado correctamente.'); // Mensaje de éxito
      this._router.navigateByUrl('/home'); // Redirige al usuario a la página de tareas
    } catch (error) {
      // Manejo de errores al intentar registrar al usuario
      toast.error((error as Error).message || 'Ocurrió un error al crear el usuario.');
    }
  }

  // Método para manejar el inicio de sesión con Google
  async submitWithGoogle() {
    try {
      // Intenta iniciar sesión con Google
      await this._authService.singInWithGoogle();
      toast.success('¡Bienvenido de nuevo!'); // Mensaje de éxito
      this._router.navigateByUrl('/home'); // Redirige al usuario a la página de tareas
    } catch (error) {
      // Manejo de errores al intentar iniciar sesión
      toast.error('Ocurrió un error.');
    }
  }

  // Método para alternar la visibilidad de la contraseña
  showPassword() {
    this.isPasswordVisible = !this.isPasswordVisible;
  }

} // :)
