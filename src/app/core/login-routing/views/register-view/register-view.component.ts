import {Component, inject, signal} from '@angular/core';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {Router, RouterLink} from '@angular/router';
import {InputTextModule} from 'primeng/inputtext';
import {PasswordModule} from 'primeng/password';
import {ButtonModule} from 'primeng/button';
import {MessageModule} from 'primeng/message';
import {AuthService} from '@cinemabooking/services/auth.service';
import {passwordMatchValidator} from '@cinemabooking/validators/password.validator';
import {RegisterDto} from '@cinemabooking/interfaces/dto/register-dto';
import {finalize} from 'rxjs';
import {HttpErrorResponse} from '@angular/common/http';

@Component({
  selector: 'app-register-view',
  imports: [
    ReactiveFormsModule,
    InputTextModule,
    PasswordModule,
    ButtonModule,
    MessageModule,
    RouterLink
  ],
  templateUrl: './register-view.component.html',
})
export class RegisterViewComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  public isLoading = signal(false);
  public errorMessage = signal('');

  public registerForm = this.fb.nonNullable.group({
    firstName: ['', [Validators.required, Validators.minLength(2)]],
    lastName: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', [Validators.required]]
  }, {
    validators: passwordMatchValidator
  });

  public isInvalid(controlName: string): boolean {
    const control = this.registerForm.get(controlName);

    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  public onSubmit(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();

      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set('');

    const formVal = this.registerForm.getRawValue();
    const dto: RegisterDto = {
      email: formVal.email,
      password: formVal.password,
      firstName: formVal.firstName,
      lastName: formVal.lastName
    };

    this.authService.register(dto)
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: () => {
          this.router.navigate(['/login']);
        },
        error: (err: HttpErrorResponse) => {
          if (err.status === 400) {
            this.errorMessage.set('Nieprawidłowe dane.');
          } else {
            this.errorMessage.set('Wystąpił błąd serwera. Spróbuj później.');
          }
        }
      });
  }
}
