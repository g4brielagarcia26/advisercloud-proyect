import { Injectable } from '@angular/core';
import { Auth, authState, signOut, User } from '@angular/fire/auth';
import { doc, docData, Firestore } from '@angular/fire/firestore';
import { BehaviorSubject, map, Observable, of, switchMap } from 'rxjs';

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
  constructor(private _auth: Auth, private firestore: Firestore) {
    // Suscripción al estado de autenticación del usuario.
    authState(this._auth).subscribe((user: User | null) => [
      console.log('Usuario autenticado en AuthStateService:', user),
      this.setUserState(user) //Llama a setUserState para actualizar el estado del usuario
    ]);
  }

  public setUserState (user: User | null) {
    console.log('Actualizando estado del usuario:', user);
    this.userSubject.next(user); // Actualiza el BehaviorSubject con el nuevo estado del usuario.
    (this.isAuthenticated = !!user); // Establece isAuthenticated en true si hay un usuario, de lo contrario false.
    (this.emailVerified = user?.emailVerified || false);// Establece emailVerified en true si el correo está verificado, de lo contrario false.
    console.log('Estado de autenticación:', this.isAuthenticated);
    console.log('Correo verificado:', this.emailVerified);
  }

  /**
   * Obtiene el estado de autenticación como un observable.
   * @returns Un observable que emite el estado de autenticación del usuario.
   */
  get authState$(): Observable<User | null> {
    return this.userSubject.asObservable(); // Devuelve el observable asociado al BehaviorSubject para permitir la suscripción desde otros componentes o servicios.
  }

    /**
   * Método para verificar el estado de autenticación del usuario.
   * Se suscribe a authState.
   * @returns Un observable que emite los datos del usuario si está autenticado.
   */
    check(): Observable<any> {
      return authState(this._auth).pipe(
        switchMap((auth: any) => {
          if (auth) {
            // Usuario autenticado
            const userReference = doc(this.firestore, `users/${auth.uid}`);
            return docData(userReference).pipe(
            map((userData: any) => {
              console.log('Datos del usuario en Firestore', userData);
              return {...auth, ...userData, emailVerified:auth.emailVerified}
            })
          )
          } else {
            // Usuario no autenticado
            return of(null);
          }
        })
      );
    }
    
/**
 * Verifica si el usuario autenticado tiene el rol de 'cliente'.
 * @returns Un observable que emite 'true' si el usuario tiene el rol de 'cliente', de lo contrario 'false'.
 */
    verifyUserRol(): Observable<boolean> {
      return this.authState$.pipe(
        switchMap((user:User | null)=> {
          if (user) {
            const userReference = doc(this.firestore, `users/${user.uid}`);
            return docData(userReference).pipe(
              map((userData: any)=> userData?.roles?.cliente === true)
            )
          } else {
            return of(false);
          }
        })
      )
    }

  /**
   * Cierra la sesión del usuario.
   * @returns Una promesa que se resuelve cuando el usuario ha cerrado sesión.
   */
  logOut() {
     // Llama a la función de Firebase para cerrar sesión.
    return signOut(this._auth)
    .then(() =>{
      this.setUserState(null);// Actualiza el estado del usuario a null tras cerrar sesión
      console.log('Usuario ha cerrado sesión.');
    })
    .catch((error)=> {
      console.log('Error al cerrar sesión: ',error);
    });
  }
} // :)
