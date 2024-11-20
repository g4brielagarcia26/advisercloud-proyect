import { Component, inject } from '@angular/core';
import { AuthService } from '../../data-access/auth.service';
import { toast } from 'ngx-sonner';
import { HeaderComponent } from '../../../home/shared-components/header/header.component';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-send-email',
  standalone: true,
  imports: [CommonModule, HeaderComponent],
  templateUrl: './send-email.component.html',
})
export default class SendEmailComponent {
  // Inyectamos el servicio de autenticación
  private _authService = inject(AuthService);
  private _router = inject(Router);

  // Propiedades para manejar el estado del botón y el temporizador
  isButtonDisabled = false; // Controla si el botón está deshabilitado
  fillWidth = 0; // Controla el ancho de llenado visual del botón
  private duration = 0; // Duración del temporizador en segundos

  ngOnInit() {
    this.startTimer();
  }

  closePage() {
    this._router.navigateByUrl('/auth/log-in');
  }

  // Método para reenviar el correo de verificación
  async resendVerificationEmail() {
    if (this.isButtonDisabled) return;

    this.isButtonDisabled = true;
    this.fillWidth = 0;
    try {
        // Enviar el correo de verificación utilizando el método del servicio
        await this._authService.sendVerificationEmail();

    } catch (error) {
      // Manejar el error y mostrar un mensaje al usuario
      toast.error(
        (error as Error).message ||
          'Ocurrió un error al reenviar el correo de verificación.'
      );
    }
    this.startTimer();
  }

  // Método para iniciar el temporizador
  private startTimer() {
    this.fillWidth = 0;
    this.duration = 60;
    const interval = setInterval(() => {
      this.fillWidth += 100 / this.duration; // Aumenta el ancho de llenado en función del tiempo
      if (this.fillWidth >= 100) {
        clearInterval(interval); // Detiene el temporizador una vez que llega a 100%
        this.isButtonDisabled = false; // Habilita el botón después de 60 segundos
      }
    }, 1000); // Cada 1000 ms (1 segundo)
    this.isButtonDisabled = true; // Desactiva el botón inicialmente al empezar el temporizador
  }
}
