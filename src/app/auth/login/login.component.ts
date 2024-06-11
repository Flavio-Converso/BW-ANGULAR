import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { ValidatorMailPasswordService } from '../validator-mail-password.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  loginForm!: FormGroup;
  errorMessage: string | null = null;
  hidePassword: boolean = true;

  constructor(
    private authSvc: AuthService,
    private router: Router,
    private fb: FormBuilder,
    private validatorSvc: ValidatorMailPasswordService
  ) {}

  ngOnInit() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: [
        '',
        [Validators.required, this.validatorSvc.isValidPassword()],
      ],
    });
  }

  login() {
    if (this.loginForm.valid) {
      this.authSvc.login(this.loginForm.value).subscribe(
        () => {
          this.router.navigate(['/']);
        },
        (error) => {
          if (error.status === 400) {
            this.errorMessage = 'Invalid login credentials. Try again';
          }
        }
      );
    } else {
      console.log('Form is invalid');
    }
  }

  togglePasswordVisibility() {
    this.hidePassword = !this.hidePassword;
  }

  isTouchedInvalid(fieldName: string) {
    const field = this.loginForm.get(fieldName);
    return field?.invalid && field?.touched;
  }
}
