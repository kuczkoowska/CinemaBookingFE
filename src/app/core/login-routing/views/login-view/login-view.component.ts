import {Component, inject, signal} from '@angular/core';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {InputTextModule} from 'primeng/inputtext';
import {PasswordModule} from 'primeng/password';
import {ButtonModule} from 'primeng/button';
import {MessageModule} from 'primeng/message';
import {AuthStore} from '@cinemabooking/stores/auth.store';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-login-view',
  imports: [
    ReactiveFormsModule,
    InputTextModule,
    PasswordModule,
    ButtonModule,
    MessageModule,
    RouterLink,
  ],
  templateUrl: './login-view.component.html',
})
export class LoginViewComponent {
  private fb = inject(FormBuilder);
  public authStore = inject(AuthStore);
  public language = signal<'pl' | 'en'>('pl');

  public translations = {
    pl: {
      title: 'Witaj ponownie!',
      subtitle: 'Zaloguj się do CinemaBooking',
      emailPlaceholder: 'E-mail',
      passwordPlaceholder: 'Hasło',
      loginButton: 'Zaloguj się',
      noAccount: 'Nie masz jeszcze konta?',
      register: 'Zarejestruj się',
      emailRequired: 'Email jest wymagany.',
      emailInvalid: 'Wprowadź poprawny email.',
      passwordRequired: 'Hasło jest wymagane.',
    },
    en: {
      title: 'Welcome back!',
      subtitle: 'Sign in to CinemaBooking',
      emailPlaceholder: 'E-mail',
      passwordPlaceholder: 'Password',
      loginButton: 'Sign In',
      noAccount: "Don't have an account?",
      register: 'Sign Up',
      emailRequired: 'Email is required.',
      emailInvalid: 'Enter a valid email.',
      passwordRequired: 'Password is required.',
    },
  };

  public t = () => this.translations[this.language()];

  public toggleLanguage(): void {
    this.language.set(this.language() === 'pl' ? 'en' : 'pl');
  }

  public loginForm = this.fb.nonNullable.group({
    username: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  public isInvalid(controlName: string): boolean {
    const control = this.loginForm.get(controlName);

    return !!(control?.invalid && (control.dirty || control.touched));
  }

  public onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();

      return;
    }

    const {username, password} = this.loginForm.getRawValue();

    this.authStore.login({username, password});
  }
}
