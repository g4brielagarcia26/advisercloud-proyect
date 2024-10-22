import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

// Servicio que gestiona el término de búsqueda compartido entre componentes.
@Injectable({
  providedIn: 'root',
})
export class SearchService {

  // Almacena el término de búsqueda actual, con un valor inicial vacío
  private searchTerm = new BehaviorSubject<string>(''); 

  // Observable que permite a otros componentes suscribirse para recibir actualizaciones del término de búsqueda
  currentSearchTerm = this.searchTerm.asObservable(); 

  // Actualiza el término de búsqueda y notifica a los suscriptores
  changeSearchTerm(term: string) {
    // next() sirve para notificar a todos los suscriptores que hay un nuevo valor disponible.
    this.searchTerm.next(term);
  }
}
