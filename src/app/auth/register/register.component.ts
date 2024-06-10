import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ValidatorMailPasswordService } from '../validator-mail-password.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {
  registerForm!: FormGroup;
  formSubmitted = false;

  constructor(
    private authSvc: AuthService,
    private router: Router,
    private fb: FormBuilder,
    private validatorSvc: ValidatorMailPasswordService
  ) {}

  ngOnInit() {
    this.registerForm = this.fb.group(
      {
        nome: [null, [Validators.required]],
        cognome: [null, [Validators.required]],
        email: [null, [Validators.required, this.validatorSvc.isValidEmail()]],
        confermaEmail: [null, [Validators.required]],
        password: [
          null,
          [Validators.required, this.validatorSvc.isValidPassword()],
        ],
        confermaPassword: [null, [Validators.required]],
        genere: ['selectPlaceholder', [Validators.required]],
        immagine: [null],
        username: [null, [Validators.required]],
      },
      {
        validators: [
          this.validatorSvc.emailMatch,
          this.validatorSvc.passwordMatch,
        ],
      }
    );
  }

  register() {
    this.formSubmitted = true;
    if (this.registerForm.valid) {
      this.authSvc.register(this.registerForm.value).subscribe(() => {
        this.router.navigate(['auth/login']);
      });
    } else {
      console.log('Form is invalid');
    }
  }

  isTouchedInvalid(fieldName: string) {
    const field = this.registerForm.get(fieldName);
    return field?.invalid && field?.touched;
  }
}
