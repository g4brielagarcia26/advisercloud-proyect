import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

// Servicio que compartirá y actualizará el término de búsqueda entre el HeaderComponent y el ToolPanelComponent.
@Injectable({
  providedIn: 'root',
})
export class SearchService {

  // Guarda el término de búsqueda.
  // BehaviorSubject permite emitir el valor actual a cualquier suscriptor nuevo y también actualizar dicho valor cuando sea necesario.
  private searchTerm = new BehaviorSubject<string>(''); 

  // Se expone el BehaviorSubject como un Observable utilizando el método asObservable(). 
  // De esta manera, otros componentes pueden suscribirse a currentSearchTerm para recibir actualizaciones cuando el término de búsqueda cambie.
  currentSearchTerm = this.searchTerm.asObservable(); 

  // Permite actualizar el término de búsqueda llamando a next(term) en el BehaviorSubject, lo cual emite el nuevo valor a todos los suscriptores.
  changeSearchTerm(term: string) {
    this.searchTerm.next(term);
  }
}
