import { Injectable } from '@angular/core';
import { Auth, authState, signOut, User } from '@angular/fire/auth';
import { BehaviorSubject, Observable } from 'rxjs';

/**
 * Servicio que maneja el estado de autenticación del usuario.
 * Proporciona un observable del estado de autenticación y métodos para gestionar la sesión del usuario.
 */
@Injectable({
  providedIn: 'root',
})
export class AuthStateService {
  // Inicializa un BehaviorSubject para almacenar el estado del usuario,     inicialmente null.
  private userSubject = new BehaviorSubject<User | null>(null);
  public isAuthenticated = false;// Variable pública que indica si hay un usuario autenticado
  public emailVerified = false;// Variable pública que indica si el correo del usuario está verificado

  // Constructor del servicio de autenticación, donde se inyecta el servicio de autenticación de Firebase
  constructor(private _auth: Auth) {
    // Suscripción al estado de autenticación del usuario.
    authState(this._auth).subscribe((user: User | null) => [
      this.userSubject.next(user), // Actualiza el BehaviorSubject con el nuevo estado del usuario
      (this.isAuthenticated = !!user), // Establece isAuthenticated en true si hay un usuario, de lo contrario false.
      (this.emailVerified = user?.emailVerified || false),// Establece emailVerified en true si el correo está verificado, de lo contrario false.
    ]);
  }

  /**
   * Obtiene el estado de autenticación como un observable.
   * @returns Un observable que emite el estado de autenticación del usuario.
   */
  get authState$(): Observable<User | null> {
    return this.userSubject.asObservable(); // Devuelve el observable asociado al BehaviorSubject para permitir la suscripción desde otros componentes o servicios.
  }

  // Método para forzar la actualización del estado usuario
  reloadUser(): void {
    const user = this._auth.currentUser; //Obtiene el usuario actual 
    this.userSubject.next(user);//se actualiza con el nuevo estado del usuario en BehaviorSubject
  }

  /**
   * Cierra la sesión del usuario.
   * @returns Una promesa que se resuelve cuando el usuario ha cerrado sesión.
   */
  logOut() {
    return signOut(this._auth); // Llama a la función de Firebase para cerrar sesión.
  }
} // :)
