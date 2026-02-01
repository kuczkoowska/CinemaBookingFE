import {Component, inject, OnInit, signal} from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import {Router, RouterLink} from '@angular/router';
import {InputTextModule} from 'primeng/inputtext';
import {PasswordModule} from 'primeng/password';
import {ButtonModule} from 'primeng/button';
import {MessageModule} from 'primeng/message';
import {AuthService} from '@cinemabooking/services/auth.service';
import {RegisterDto} from '@cinemabooking/interfaces/dto/register-dto';
import {finalize} from 'rxjs';
import {HttpErrorResponse} from '@angular/common/http';
import {TranslatePipe, TranslateService} from '@ngx-translate/core';
import {AuthStore} from '@cinemabooking/stores/auth.store';
import {RegisterForm} from '@cinemabooking/interfaces/form/register-form';

@Component({
  selector: 'app-register-view',
  imports: [
    ReactiveFormsModule,
    InputTextModule,
    PasswordModule,
    ButtonModule,
    MessageModule,
    TranslatePipe,
    RouterLink,
  ],
  templateUrl: './register-view.component.html',
})
export class RegisterViewComponent implements OnInit {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  protected authStore = inject(AuthStore);
  private router = inject(Router);
  public translateService = inject(TranslateService);

  public isLoading = signal(false);
  public errorMessage = signal('');

  public registerForm: FormGroup<RegisterForm> = this.fb.nonNullable.group({
    firstName: ['', [Validators.required, Validators.minLength(2)]],
    lastName: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', [Validators.required]],
  }, {
    validators: this.passwordMatchValidator
  });

  public ngOnInit(): void {
    this.translateService.use('pl');
  }

  protected changeLanguage(): void {
    const lang = this.translateService.getCurrentLang();
    this.translateService.use(lang === 'pl' ? 'en' : 'pl');
  }

  private passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');

    if (!password || !confirmPassword) {
      return null;
    }

    return password.value === confirmPassword.value ? null : {passwordMismatch: true};
  }

  public isInvalid(controlName: string): boolean {
    const control = this.registerForm.get(controlName);

    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  public hasPasswordMismatch(): boolean {
    return !!(
      this.registerForm.errors?.['passwordMismatch'] &&
      this.registerForm.get('confirmPassword')?.touched
    );
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
            this.errorMessage.set('Nieprawidłowe dane');
          } else {
            this.errorMessage.set('Błąd serwera. Spróbuj ponownie później.');
          }
        },
      });
  }
}
