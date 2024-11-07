import { Injectable } from '@angular/core';
import { Firestore, collectionData, collection, doc, getDoc, updateDoc, deleteDoc } from '@angular/fire/firestore';
import { getStorage, ref, getDownloadURL } from '@angular/fire/storage';
import { Observable, from } from 'rxjs';
import { ToolModel } from '../tool-model/tool.model'; 

@Injectable({
  providedIn: 'root'
})
export class ToolService {

  // Inicializa el servicio de Storage.
  private storage = getStorage();

  // Inyecta Firestore para que esté disponible en la clase y pueda ser utilizado para interactuar con la base de datos.
  constructor(private firestore: Firestore) {}

  // Recupera la lista de herramientas desde la colección 'tools' en Firestore.
  getTools(): Observable<ToolModel[]> {
    // Obtiene una referencia a la colección tools en Firestore.
    const toolsCollection = collection(this.firestore, 'tools');

    // Recupera los datos de la colección, y { idField: 'id' } agrega el ID del documento como un campo en los objetos recuperados.
    // Devuelve un Observable de un array de ToolModel, lo que permite suscribirse a los datos y manejar cambios en tiempo real.
    return collectionData(toolsCollection, { idField: 'id' }) as Observable<ToolModel[]>;
  }

  // Método para eliminar una herramienta
  deleteTool(toolId: string): Observable<void> {
    // Creamos una referencia al documento específico en Firestore
    const toolDocRef = doc(this.firestore, `tools/${toolId}`);
    // Utilizamos deleteDoc para eliminar el documento y convertimos la promesa en un Observable con `from`
    return from(deleteDoc(toolDocRef));
  }

  // Método para alternar el estado favorito de una herramienta
  toggleFavorite(toolId: string): Observable<void> {

    // Creamos una referencia al documento específico en Firestore con doc()
    const toolDocRef = doc(this.firestore, `tools/${toolId}`);

    return from(getDoc(toolDocRef).then(docSnapshot => {
      if (docSnapshot.exists()) {
        const currentFavoriteStatus = docSnapshot.data()['isFavorite'] || false;
        // Invertir el valor de isFavorite y actualizar en Firestore
        return updateDoc(toolDocRef, { isFavorite: !currentFavoriteStatus });
      } else {
        throw new Error('El documento no existe');
      }
    }));
  }
  

  // Obtiene la URL de descarga de un archivo almacenado en Firebase Storage.
  getDownloadUrl(path: string): Observable<string> {
    // Crea una referencia al archivo en el almacenamiento usando la ruta proporcionada.
    const storageRef = ref(this.storage, path);

    // getDownloadURL(storageRef) Obtiene la URL de descarga para ese archivo.
    // from(...): Convierte la promesa devuelta por getDownloadURL en un Observable para un manejo reactivo.
    return from(getDownloadURL(storageRef)); 
  }

} // :)