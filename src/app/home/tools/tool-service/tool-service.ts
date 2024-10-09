import { Injectable } from '@angular/core';
import { Firestore, collectionData, collection, addDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { ToolModel } from '../tool-model/tool.model'; // Asegúrate de ajustar la ruta

@Injectable({
  providedIn: 'root' // Hace que el servicio esté disponible en toda la aplicación
})
export class ToolService {

  constructor(private firestore: Firestore) {}

  // Método para obtener la lista de herramientas desde Firestore
  getTools(): Observable<ToolModel[]> {
    const toolsCollection = collection(this.firestore, 'tools');
    return collectionData(toolsCollection, { idField: 'id' }) as Observable<ToolModel[]>;
  }

}
