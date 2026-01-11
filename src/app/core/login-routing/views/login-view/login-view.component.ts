import {Component, inject} from '@angular/core';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';

import {InputTextModule} from 'primeng/inputtext';
import {PasswordModule} from 'primeng/password';
import {ButtonModule} from 'primeng/button';
import {MessageModule} from 'primeng/message';
import {AuthStore} from '@cinemabooking/stores/auth.store';

@Component({
  selector: 'app-login-view',
  standalone: true,
  imports: [ReactiveFormsModule,
    ReactiveFormsModule,
    InputTextModule,
    PasswordModule,
    ButtonModule,
    MessageModule
  ],
  templateUrl: './login-view.component.html',
})
export class LoginViewComponent {
  private fb = inject(FormBuilder);
  authStore = inject(AuthStore);

  loginForm = this.fb.nonNullable.group({
    username: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  isInvalid(controlName: string): boolean {
    const control = this.loginForm.get(controlName);
    
return !!(control?.invalid && (control.dirty || control.touched));
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      
return;
    }

    const {username, password} = this.loginForm.getRawValue();

    this.authStore.login({username, password});
  }

}
