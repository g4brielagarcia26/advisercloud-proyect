import { inject, Injectable } from '@angular/core';
import {
  Auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  UserCredential,
  sendEmailVerification,
  sendPasswordResetEmail,
} from '@angular/fire/auth';
import {
  collection,
  doc,
  Firestore,
  getDoc,
  getDocs,
  query,
  setDoc,
  where,
} from '@angular/fire/firestore';
import { AuthStateService } from '../../shared/data-access/auth-state.service';

// Definimos nuestra interfaz "User", que será utilizada para estructurar los datos del usuario.
export interface User {
  firstName: string;
  lastName: string;
  displayName: string;
  email: string;
  password: string;
  authMethod: string;
  photoURL?: string;
  initial?: string;
  roles: {
    admin?: boolean;
    cliente?: boolean;
  }
}

@Injectable({
  providedIn: 'root', // Esto indica que este servicio está disponible globalmente en toda la aplicación.
})
export class AuthService {
  // Inyectamos los servicios de autenticación y Firestore de Firebase mediante la función "inject".
  private _auth = inject(Auth);
  private _authState = inject(AuthStateService);
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
        uid, // UID del usuario proporcionado por Firebase Authentication
        email: user.email, // Correo electrónico del usuario
        firstName: user.firstName, // Primer nombre del usuario
        lastName: user.lastName, // Apellido del usuario
        displayName: `${user.firstName} ${user.lastName}`, //Nombre completo
        authMethod: 'email', //Método con el que se ha autenticado el usuario
        createdAt: new Date(), // Fecha de creación del registro del usuario
        roles:{cliente:true}, //Se asigna rol de cliente por defecto
      };

      // Guardamos el objeto "userData" en Firestore bajo la colección "users", utilizando el UID como ID del documento.
      await setDoc(doc(this._firestore, `users/${uid}`), userData);

      // Llama al método para actualizar el estado de autenticación.
      this._authState.setUserState(userCredential.user);
      console.log(
        'Estado de usuario actualizado en AuthStateService:',
        userCredential.user
      );

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
  async signIn(user: Pick<User, 'email' | 'password'>) {
    try {
      console.log('Itentando iniciar sesion con: ', user.email);

      // Iniciar sesión con email y contraseña
      const userCredential = await signInWithEmailAndPassword(
        this._auth,
        user.email,
        user.password
      );

      // Obtener el usuario autenticado
      const currentUser = userCredential.user;
      console.log('Usuario autenticado:', currentUser);

      // Verificar si el correo ha sido verificado
      if (!currentUser.emailVerified) {
        console.log('Correo no verificado para el usuario:', currentUser.email);
        // Si el correo no está verificado, lanza un error
        throw new Error('Correo no verificado.');
      }

      // Llama al método para actualizar el estado de autenticación.
      this._authState.setUserState(currentUser);
      console.log(
        'Estado de usuario actualizado en AuthStateService:',
        currentUser
      );

      // Si el correo está verificado, retornar las credenciales
      return userCredential;
    } catch (error: any) {
      // Manejar error de contraseña incorrecta de Firebase
      if (error.code === 'auth/invalid-credential') {
        throw new Error('Credenciales incorrectas.');
      }
      // Reenvía el mensaje de error desde Firebase
      throw new Error(error.message || 'Error en la autenticación.');
    }
  }

  /**
   * Método para iniciar sesión utilizando la autenticación de Google (OAuth).
   * @returns Una promesa que resuelve con las credenciales del usuario que ha iniciado sesión mediante Google.
   */
  async singInWithGoogle(): Promise<UserCredential> {
    try {
      // Proveedor de autenticación de Google.
      const provider = new GoogleAuthProvider();
      //Forzar selección de cuenta
      provider.setCustomParameters({
        prompt: 'select_account',
      });
      // Llamada a Firebase Authentication para iniciar sesión con el popup de Google.
      const userCredential = await signInWithPopup(this._auth, provider);
      // Obtener el UID (Identificador Único) del usuario autenticado.
      const uid = userCredential.user?.uid;

      // Estructuramos los datos del usuario que queremos guardar en Firestore, incluyendo el correo y los nombres.
      const userData = {
        uid, // UID del usuario proporcionado por Firebase Authentication
        email: userCredential.user?.email, // Correo electrónico del usuario
        displayName: userCredential.user?.displayName, //Nombre completo del usuario
        authMethod: 'google', //Método con el que se ha autenticado el usuario
        createdAt: new Date(), // Fecha de creación del registro del usuario
        roles: {cliente:true}, //Se asigna rol de cliente por defecto
      };

      // Guardamos el objeto "userData" en Firestore bajo la colección "users", utilizando el UID como ID del documento.
      await setDoc(doc(this._firestore, `users/${uid}`), userData);

      // Devolver las credenciales del usuario autenticado.
      return userCredential;
    } catch (error) {
      // En caso de error, lanzar un mensaje detallado con el error ocurrido durante el inicio de sesión con Google.
      throw new Error(
        'Error al iniciar sesión con Google: ' + (error as Error).message
      );
    }
  }

  /**
   * Método en el que recoge los datos del usuario desde fireStore.
   * @param uid -El identificador único del usuario.
   * @returns -Una promesa que se resuelve con los datos del usuario como un objeto de tipo User, o null si el usuario no existe.
   */
  async getUserData(uid: string): Promise<User | null> {
    try {
      const userDoc = await getDoc(doc(this._firestore, `users/${uid}`));
      if (userDoc.exists()) {
        const userData = userDoc.data() as User;
        if (userData.displayName) {
          userData.initial = this.getInitial(userData.displayName);
        }
        return userData;
      } else {
        return null;
      }
    } catch (error) {
      throw new Error(
        'Error al obtener los datos del usuario: ' + (error as Error).message
      );
    }
  }

  /**
   * Función que devuelve la inicial de un nombre en mayúsculas.
   * @param name -El nombre del cual se quiere obtener la inicial.
   * @returns -La inicial del nombre en mayúsculas.
   */
  getInitial(name: string): string {
    return name.charAt(0).toUpperCase();
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

  /**
   * Método para enviar un correo de verificación al usuario.
   * @returns Una promesa que se resuelve cuando el correo es enviado.
   */
  async sendVerificationEmail(): Promise<void> {
    // Obtenemos el usuario autenticado actualmente
    const user = this._auth.currentUser;

    // Verifica que exista un usuario autenticado antes de enviar el correo
    if (user) {
      await sendEmailVerification(user);
    } else {
      throw new Error('No se encontró ningún usuario con estos datos.');
    }
  }

  /**
   *Método para restablecer la contraseña
   */
  async sendPasswordResetEmail(email: string): Promise<void> {
    try {
      await sendPasswordResetEmail(this._auth, email);
    } catch (error) {
      throw new Error('Error en submit');
    }
  }
} // :)
