import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';
import { AuthService } from '@cinemabooking/services/auth.service';
import { passwordMatchValidator } from '@cinemabooking/validators/password.validator';
import { RegisterDto } from '@cinemabooking/interfaces/dto/register-dto';
import { finalize } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-register-view',
  imports: [
    ReactiveFormsModule,
    InputTextModule,
    PasswordModule,
    ButtonModule,
    MessageModule,
    RouterLink,
  ],
  templateUrl: './register-view.component.html',
})
export class RegisterViewComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  public isLoading = signal(false);
  public errorMessage = signal('');
  public language = signal<'pl' | 'en'>('pl');

  public translations = {
    pl: {
      title: 'Załóż konto',
      subtitle: 'Dołącz do CinemaBooking w 30 sekund',
      firstName: 'Imię',
      lastName: 'Nazwisko',
      email: 'Email',
      password: 'Hasło',
      confirmPassword: 'Powtórz hasło',
      registerButton: 'Zarejestruj się',
      haveAccount: 'Masz już konto?',
      signIn: 'Zaloguj się',
      firstNamePlaceholder: 'Jan',
      lastNamePlaceholder: 'Kowalski',
      emailPlaceholder: 'jan@example.com',
      firstNameError: 'Wymagane (min 2 znaki).',
      lastNameError: 'Wymagane (min 2 znaki).',
      emailError: 'Wpisz poprawny adres email.',
      passwordError: 'Hasło jest za krótkie.',
      passwordMismatch: 'Hasła muszą być identyczne.',
      passwordHint: 'Wskazówka: Użyj minimum 6 znaków.',
      errorInvalidData: 'Nieprawidłowe dane.',
      errorServer: 'Wystąpił błąd serwera. Spróbuj później.',
    },
    en: {
      title: 'Create Account',
      subtitle: 'Join CinemaBooking in 30 seconds',
      firstName: 'First Name',
      lastName: 'Last Name',
      email: 'Email',
      password: 'Password',
      confirmPassword: 'Confirm Password',
      registerButton: 'Sign Up',
      haveAccount: 'Already have an account?',
      signIn: 'Sign In',
      firstNamePlaceholder: 'John',
      lastNamePlaceholder: 'Doe',
      emailPlaceholder: 'john@example.com',
      firstNameError: 'Required (min 2 characters).',
      lastNameError: 'Required (min 2 characters).',
      emailError: 'Enter a valid email address.',
      passwordError: 'Password is too short.',
      passwordMismatch: 'Passwords must match.',
      passwordHint: 'Hint: Use at least 6 characters.',
      errorInvalidData: 'Invalid data.',
      errorServer: 'A server error occurred. Try again later.',
    },
  };

  public t = () => this.translations[this.language()];

  public toggleLanguage(): void {
    this.language.set(this.language() === 'pl' ? 'en' : 'pl');
  }

  public registerForm = this.fb.nonNullable.group(
    {
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
    },
    {
      validators: passwordMatchValidator,
    },
  );

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
      lastName: formVal.lastName,
    };

    this.authService
      .register(dto)
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: () => {
          this.router.navigate(['/login']);
        },
        error: (err: HttpErrorResponse) => {
          if (err.status === 400) {
            this.errorMessage.set(this.t().errorInvalidData);
          } else {
            this.errorMessage.set(this.t().errorServer);
          }
        },
      });
  }
}
