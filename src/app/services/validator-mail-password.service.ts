import { Injectable } from '@angular/core';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class ValidatorMailPasswordService {
  constructor() {}
  //
  //funzione per controllare se la mail è valida
  isValidEmail(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const emailRegex = new RegExp(
        '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$'
      ).test(control.value);
      return emailRegex
        ? null // se  valida
        : { isValidEmail: "L'email selezionata non è valida" }; // se non valida
    };
    // [A-Za-z0-9._%+-]+: email deve iniziare con uno o più caratteri alfanumerici, punti, trattini bassi, percentuali, più o trattini.
    // @:  deve esserci una chiocciola, carattere obbligatorio
    // [A-Za-z0-9.-]+:  dopo la chiocciola devono esserci uno o più caratteri alfanumerici, punti o trattini. rappresenta il dominio
    // \\.: deve esserci un punto dopo il dominio
    // [A-Za-z]{2,}: dopo il punto ci devono essere almeno due caratteri alfabetici (es. com, it, org, net, ecc.).
  }

  // DA USARE SE C'E' LA CONFERMA IN UN SECONDO CAMPO EMAIL
  //
  //funzione per controllare match tra le email
  emailMatch(control: AbstractControl) {
    const emailControl = control.get('email');
    const confirmEmailControl = control.get('confermaEmail');
    //se non esistono i campi
    if (!emailControl || !confirmEmailControl) {
      return null;
      //se esistono i campi
    } else {
      return emailControl.value === confirmEmailControl.value //se le email sono uguali
        ? null //se valida
        : { emailMatch: false }; //se non valida
    }
  }

  //
  // Funzione per controllare se la password è valida
  isValidPassword(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const psw = new RegExp(
        '^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,16}$'
      ).test(control.value);
      return psw
        ? null //se valida
        : {
            isValidPassword:
              'La password deve contenere caratteri speciali, un numero, una maiuscola e deve essere tra 8 e 16 caratteri.',
          }; //se non valida
    };
    //Almeno una lettera maiuscola ((?=.*?[A-Z])).
    //Almeno una lettera minuscola ((?=.*?[a-z])).
    //Almeno un numero ((?=.*?[0-9])).
    //Almeno un carattere speciale tra #?!@$%^&*- ((?=.*?[#?!@$%^&*-])).
    //Lunghezza minima di 8 caratteri e massima di 16 (.{8,16}).
  }

  // DA USARE SE C'E' LA CONFERMA IN UN SECONDO CAMPO PASSWORD
  //
  //funzione per controllare match tra le password
  passwordMatch(control: AbstractControl) {
    const passwordControl = control.get('password');
    const confirmPasswordControl = control.get('confermaPassword');
    //se non esistono i campi
    if (!passwordControl || !confirmPasswordControl) {
      return null;
      //se esistono i campi
    } else {
      return passwordControl.value === confirmPasswordControl.value //se le password sono uguali
        ? null //se valida
        : { passwordMatch: false }; //se non valida
    }
  }
}
