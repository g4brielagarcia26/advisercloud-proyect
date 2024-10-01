import { inject, Injectable } from "@angular/core";
import { Auth, authState, signOut } from "@angular/fire/auth";
import { Observable } from "rxjs";

/**
 * Servicio que maneja el estado de autenticación del usuario.
 * Proporciona un observable del estado de autenticación y métodos para gestionar la sesión del usuario.
 */
@Injectable({
  providedIn: 'root', 
})
export class AuthStateService {
  private _auth = inject(Auth); // Inyecta el servicio de autenticación de Firebase.

  /**
   * Obtiene el estado de autenticación como un observable.
   * @returns Un observable que emite el estado de autenticación del usuario.
   */
  get authState$(): Observable<any> {
    return authState(this._auth); // Devuelve el observable del estado de autenticación.
  }

  /**
   * Cierra la sesión del usuario.
   * @returns Una promesa que se resuelve cuando el usuario ha cerrado sesión.
   */
  logOut() {
    return signOut(this._auth); // Llama a la función de Firebase para cerrar sesión.
  }

} // :)