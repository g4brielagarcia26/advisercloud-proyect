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

// :)