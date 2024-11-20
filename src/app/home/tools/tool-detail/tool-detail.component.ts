import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { ToolModel } from '../tool-model/tool.model';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { AuthStateService } from '../../../shared/data-access/auth-state.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tool-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tool-detail.component.html',
  styleUrl: './tool-detail.component.css'
})

export class ToolDetailComponent {
  @Input() toolData: ToolModel| null = null;  
  @Output() closeModal = new EventEmitter<void>();

  sanitizer = inject(DomSanitizer); // Inyecta DomSanitizer que permite marcar una URL como segura para ser usada en un iframe, evitando problemas de seguridad.

  

  private authStateService = inject(AuthStateService); // Inyecta el servicio para manejar autenticación
  private router = inject(Router); // Inyecta el router para redirecciones

  isAuthenticated = false; // Estado de autenticación del usuario

  constructor() {
    // Suscripción al estado de autenticación
    this.authStateService.authState$.subscribe((user) => {
      this.isAuthenticated = !!user && !!user.emailVerified;
    });
  }
  

  // Función para transformar la URL de YouTube en una URL segura para usar en un iframe
  getEmbedUrl(video: string): SafeResourceUrl { //Recibe una url, que en este caso es la URL normal del video en YouTube
    const videoId = this.extractVideoId(video); // Extrae el ID del video de la URL
    const embedUrl = `https://www.youtube.com/embed/${videoId}`; //Genera una URL embebida, es decir usa el ID del video para crear una URL de embed en el formato correcto de YouTube
    return this.sanitizer.bypassSecurityTrustResourceUrl(embedUrl); // Sanitiza la URL, lo que hace que la marquemos como segura para el resto del iframe
  }

  // Función para extraer el ID del video de la URL
  private extractVideoId(url: string): string { 
    const urlParts = url.split("v="); // Divide la URL en partes usando 'v=' como separador
    if (urlParts.length > 1) {  // Verifica que hay una parte después de 'v='
      const id = urlParts[1]; // Obtiene la parte que contiene el ID del video
      const ampersandPosition = id.indexOf("&"); // Busca si hay un '&' en el ID
      if (ampersandPosition !== -1) { // Si hay un '&', significa que hay más parámetros
        return id.substring(0, ampersandPosition); // Devuelve solo el ID del video
      }
      return id; // Si no hay '&', simplemente devuelve el ID
    }
    return ""; // Si no se encuentra un ID, devuelve una cadena vacía
  }

  close() {
    this.closeModal.emit();
  }



  //Maneja las acciones de "Comprar" o "Descargar".

  handleAction(action: 'comprar' | 'descargar'): void {
    if (!this.isAuthenticated) {
      console.log('Usuario no autenticado. Redirigiendo al login.');
      this.router.navigate(['/auth/log-in']);
    } else {
      console.log(`Ejecutando acción: ${action}`);
      if (action === 'comprar') {
        // Lógica para comprar
        console.log('Redirigiendo a la página de compra...');
        this.router.navigate(['/comprar']);
        //Ahora redigiría a la plataforma de pago
      } else if (action === 'descargar') {
        // Lógica para descargar
        console.log('Descargando herramienta...');
      }
    }
  }
   
  
}
