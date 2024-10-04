import { Component, inject } from '@angular/core';
import { AuthService } from '../../data-access/auth.service';
import { toast } from 'ngx-sonner';
import { HeaderComponent } from '../../../home/shared-components/header/header.component';

@Component({
  selector: 'app-send-email',
  standalone: true,
  imports: [HeaderComponent],
  templateUrl: './send-email.component.html'
})
export default class SendEmailComponent {
  
  // Inyectamos el servicio de autenticación
  private _authService = inject(AuthService);

  // Método para reenviar el correo de verificación
  async resendVerificationEmail() {
    try {
      
      // Enviar el correo de verificación utilizando el método del servicio
      await this._authService.sendVerificationEmail();

    } catch (error) {
      // Manejar el error y mostrar un mensaje al usuario
      toast.error((error as Error).message || 'Ocurrió un error al reenviar el correo de verificación.');
    }
  }
}