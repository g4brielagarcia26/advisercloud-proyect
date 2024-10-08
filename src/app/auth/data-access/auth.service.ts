import { inject, Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, UserCredential } from '@angular/fire/auth';
import { collection, doc, Firestore, getDocs, query, setDoc, where } from '@angular/fire/firestore';

// Definimos nuestra interfaz "User", que será utilizada para estructurar los datos del usuario.
export interface User {
  firstName: string,
  lastName: string,
  email: string;
  password: string;
}

@Injectable({
  providedIn: 'root' // Esto indica que este servicio está disponible globalmente en toda la aplicación.
})
export class AuthService {

  // Inyectamos los servicios de autenticación y Firestore de Firebase mediante la función "inject".
  private _auth = inject(Auth);
  private _firestore = inject(Firestore);

  /**
   * Método para registrar un nuevo usuario en Firebase Authentication y guardar los datos del usuario en Firestore.
   * @param user - Datos del usuario, incluyendo el correo electrónico, la contraseña, el nombre y el apellido.
   * @returns Una promesa que se resuelve con las credenciales del usuario recién creado (UserCredential).
   */
  async signUp(user: User): Promise<UserCredential> {

    try {
      // Crea una nueva cuenta de usuario en Firebase Authentication con correo electrónico y contraseña.
      const userCredential = await createUserWithEmailAndPassword(
        this._auth,
        user.email,
        user.password
      );

      // Obtener el UID (Identificador Único) del usuario autenticado.
      const uid = userCredential.user?.uid;

      // Estructuramos los datos del usuario que queremos guardar en Firestore, incluyendo el correo y los nombres.
      const userData = {
        uid,  // UID del usuario proporcionado por Firebase Authentication
        email: user.email,  // Correo electrónico del usuario
        firstName: user.firstName,  // Primer nombre del usuario
        lastName: user.lastName,  // Apellido del usuario
        createdAt: new Date(),  // Fecha de creación del registro del usuario
      };

      // Guardamos el objeto "userData" en Firestore bajo la colección "users", utilizando el UID como ID del documento.
      await setDoc(doc(this._firestore, `users/${uid}`), userData);

      // Devolver las credenciales del usuario creado.
      return userCredential;

    } catch (error) {
      // En caso de error, lanzar un mensaje detallado con el error ocurrido durante la creación del usuario.
      throw new Error('Error al crear el usuario: ' + (error as Error).message);
    }
  }

  /** 
   * Método para iniciar sesión con correo electrónico y contraseña.
   * @param user - Objeto que contiene el correo electrónico y la contraseña del usuario.
   * @returns Una promesa que resuelve con las credenciales del usuario que ha iniciado sesión.
   */
  signIn(user: Pick<User, 'email' | 'password'>) {
    // Llamada a Firebase Authentication para iniciar sesión utilizando el correo y la contraseña proporcionados.
    return signInWithEmailAndPassword(
      this._auth,
      user.email,
      user.password
    );
  }

  /**
   * Método para iniciar sesión utilizando la autenticación de Google (OAuth).
   * @returns Una promesa que resuelve con las credenciales del usuario que ha iniciado sesión mediante Google.
   */
  singInWithGoogle() {
    // Proveedor de autenticación de Google.
    const provider = new GoogleAuthProvider();
    
    // Llamada a Firebase Authentication para iniciar sesión con el popup de Google.
    return signInWithPopup(this._auth, provider);
  }

  /**
   * Método para verificar si el usuario ya está registrado en Firestore.
   * @param email - El correo electrónico del usuario que se va a verificar.
   * @returns Una promesa que se resuelve con un valor booleano, `true` si el usuario existe, `false` si no existe.
   */
  async checkUserExists(email: string): Promise<boolean> {
    // Referencia a la colección de usuarios en Firestore.
    const usersRef = collection(this._firestore, 'users');

    // Creamos una consulta para buscar usuarios cuyo campo 'email' coincida con el proporcionado.
    const q = query(usersRef, where('email', '==', email));

    // Ejecutamos la consulta y obtenemos los documentos que coincidan.
    const querySnapshot = await getDocs(q);

    // Si hay al menos un documento, significa que el usuario ya existe.
    return !querySnapshot.empty;
  }

} // :)
