import { Component, HostListener, inject } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { isRequired, hasEmailError } from '../../utils/validators/validators';
import { AuthService } from '../../data-access/auth.service';
import { Router, RouterLink } from '@angular/router';
import { toast } from 'ngx-sonner';
import { GoogleButtonComponent } from '../google-button/google-button.component';
import { async } from 'rxjs';

interface FormLogIn {
  email: FormControl<string | null>;
  password: FormControl<string | null>;
}

@Component({
  selector: 'app-log-in',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, GoogleButtonComponent],
  templateUrl: './log-in.component.html'
})
export default class LogInComponent {

  // Todas las validaciones presentes en el componente provienen de auth/utils/validators.ts
  // Se realizan a parte con la intención de ser reutilizadas.

  // Inyección de dependencias necesarias para el funcionamiento del componente.
  private _formBuilder = inject(FormBuilder); // FormBuilder se usa para crear un grupo de controles de formulario reactivos.
  private _authService = inject(AuthService); // Servicio de autenticación personalizado que maneja las acciones de autenticación.
  private _router = inject(Router); // Router para la navegación entre diferentes rutas en la aplicación.

  // Flag para controlar la visibilidad de la contraseña
  isPasswordVisible = false;

  /**
   * Verifica si un campo específico del formulario es requerido y no está completo.
   * @param field - El campo a verificar ('email' o 'password').
   * @returns `true` si el campo está vacío y es requerido, de lo contrario `false`.
   */
  isRequired(field: 'email' | 'password') {
    return isRequired(field, this.form); // Función externa que verifica si el campo es requerido.
  }

  /**
   * Verifica si hay un error en el campo de correo electrónico (por ejemplo, formato inválido).
   * @returns `true` si hay un error en el campo de correo electrónico, de lo contrario `false`.
   */
  hasEmailError() {
    return hasEmailError(this.form); // Función externa que valida si el correo tiene algún error de formato.
  }

  // Definición del formulario reactivo con los campos 'email' y 'password'.
  form = this._formBuilder.group<FormLogIn>({
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
      ])
  });

  /**
   * Envía el formulario de inicio de sesión si es válido. 
   * Intenta iniciar sesión utilizando el servicio de autenticación con correo y contraseña.
   * Si el inicio de sesión es exitoso, redirige al usuario a la página principal.
   * Si ocurre un error, muestra una notificación al usuario.
   */
  async submit() {

    // Si el formulario es inválido, mostrar mensaje de error y detener la ejecución.
    if (this.form.invalid) {
      toast.error('Formulario inválido. Por favor completa todos los campos correctamente.');
      return;
    }

    // Extrae el email y password del formulario.
    const { email, password } = this.form.value;

    // Si faltan el email o la contraseña, mostrar un mensaje de error y detener el envío.
    if (!email || !password) return;

    try {
      // Llama al servicio de autenticación para iniciar sesión.
      await this._authService.signIn({ email, password });

      // Si el inicio de sesión es exitoso, navegar a la página principal
      toast.success('¡Bienvenido nuevamente!');
      this._router.navigateByUrl('/home/tool-panel');

    } catch (error: any) {
      // Si el error es relacionado con la verificación de correo, mostrar un mensaje específico
      if (error.message === 'Correo no verificado.') {
        toast.error('Correo no verificado. Por favor verifica tu cuenta antes de iniciar sesión.');
        // Si la contraseña es incorrecta
      } else if (error.message === 'Credenciales incorrectas.') {
        toast.error('El correo o contraseña no son correctos.');
        // Manejar cualquier otro error (genérico o inesperado)
      } else {
        toast.error(error.message || 'Ocurrió un error al iniciar sesión');
      }
    }
  }
  //Escucha el evento de pulsar la tecla enter para enviar el formulario
  @HostListener('document:keydown.enter', ['$event'])
  handleEnterKey(event: KeyboardEvent) {
    event.preventDefault();
    this.submit();
  }

  /**
   * Inicia sesión usando la autenticación de Google.
   * Si el inicio de sesión es exitoso, redirige al usuario a la página home.
   * Si ocurre un error, muestra una notificación de error.
   */
  async submitWithGoogle() {
    try {
      // Llama al servicio para iniciar sesión con Google.
      await this._authService.singInWithGoogle();

      toast.success('¡Bienvenido de nuevo!'); // Muestra un mensaje de éxito al usuario.
      this._router.navigateByUrl('/home/tool-panel'); // Redirige al usuario a la página de tareas.
    } catch (error) {
      toast.error('Ocurrió un error.'); // Muestra un mensaje de error si la autenticación falla.
    }
  }

  // Método para alternar la visibilidad de la contraseña.
  showPassword() {
    this.isPasswordVisible = !this.isPasswordVisible;
  }

} // :)