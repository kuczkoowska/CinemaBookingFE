import {Component, inject, OnInit} from '@angular/core';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {InputTextModule} from 'primeng/inputtext';
import {PasswordModule} from 'primeng/password';
import {ButtonModule} from 'primeng/button';
import {MessageModule} from 'primeng/message';
import {AuthStore} from '@cinemabooking/stores/auth.store';
import {TranslateModule, TranslatePipe, TranslateService} from '@ngx-translate/core';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-login-view',
  imports: [
    ReactiveFormsModule,
    InputTextModule,
    PasswordModule,
    ButtonModule,
    MessageModule,
    TranslateModule,
    TranslatePipe,
    RouterLink
  ],
  templateUrl: './login-view.component.html',
})
export class LoginViewComponent implements OnInit {
  private fb = inject(FormBuilder);
  public authStore = inject(AuthStore);
  public translateService = inject(TranslateService);

  public loginForm = this.fb.nonNullable.group({
    username: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  public ngOnInit(): void {
    this.translateService.use('pl');
  }

  protected changeLanguage(): void {
    const lang = this.translateService.getCurrentLang();
    this.translateService.use(lang === 'pl' ? 'en' : 'pl');
  }

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
