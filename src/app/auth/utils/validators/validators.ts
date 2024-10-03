import { FormGroup } from "@angular/forms";

/**
 * Validador que verifica si un campo es requerido.
 * 
 * @param field - El nombre del campo que se desea validar. Puede ser 'firstName', 'lastName', 'email' o 'password'.
 * @param form - El formulario que contiene los campos a validar.
 * @returns Devuelve true si el campo es requerido, está tocado y tiene un error de validación; de lo contrario, devuelve false.
 */
export const isRequired = (field: 'firstName' | 'lastName' | 'email' | 'password', form: FormGroup) => {
  const control = form.get(field); // Obtiene el control del campo especificado.

  // Verifica si el control existe, ha sido tocado y tiene el error de 'required'.
  return control && control.touched && control.hasError('required');
};

/**
 * Validador que verifica si hay un error de formato en el campo de correo electrónico.
 * 
 * @param form - El formulario que contiene los campos a validar.
 * @returns Devuelve true si el campo de correo electrónico es tocado y tiene un error de validación de tipo 'email'; de lo contrario, devuelve false.
 */
export const hasEmailError = (form: FormGroup) => {
  const control = form.get('email'); // Obtiene el control del campo de correo electrónico.
  
  // Verifica si el control existe, ha sido tocado y tiene el error de 'email'.
  return control && control?.touched && control.hasError('email');
};

/**
 * Valida si existe un error en el campo de la contraseña.
 * 
 * @param {FormGroup} form - El formulario que contiene el campo de contraseña a validar.
 * @param {boolean} attempedSubmit - Indicador de si se ha intentado enviar el formulario. 
 * @returns {boolean} - Retorna `true` si el campo de contraseña tiene errores de validación 
 *                      (como errores de patrón o longitud mínima) y si el formulario ha sido 
 *                      tocado tras un intento de envío. Retorna `false` en caso contrario.
 * 
 * @description Este validador comprueba si el campo de contraseña dentro de un formulario 
 *              tiene errores de validación. Los errores que se consideran son:
 *              - `pattern`: El valor de la contraseña no coincide con el patrón esperado.
 *              - `minlength`: La contraseña no cumple con la longitud mínima requerida.
 *              
 *              Solo se validan los errores si se ha intentado enviar el formulario y 
 *              el campo de contraseña ha sido tocado (es decir, el usuario ha interactuado con él).
 */
export const hasPasswordError = (form: FormGroup, attempedSubmit: boolean) => {
  const control = form.get('password'); // Obtiene el control del campo de correo electrónico.

  // Retorna true si el campo de contraseña existe, si se ha intentando enviar el formulario,
  // si el campo de contraseña ha sido tocado y si el campo tiene errores de patrón o longitud máxima.
  return control && attempedSubmit && control?.touched && (
    control.hasError('pattern') || control.hasError('minlegth')
  );
}

// :)