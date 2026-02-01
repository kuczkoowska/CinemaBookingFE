import {Component, effect, inject, signal} from '@angular/core';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {AuthStore} from '@cinemabooking/stores/auth.store';
import {UserStore} from '@cinemabooking/stores/user.store';
import {Button} from 'primeng/button';
import {InputText} from 'primeng/inputtext';

@Component({
  selector: 'app-edit-view',
  imports: [
    Button,
    ReactiveFormsModule,
    InputText
  ],
  templateUrl: './edit-view.component.html',
})
export class EditViewComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authStore = inject(AuthStore);
  private readonly userStore = inject(UserStore);
  private readonly router = inject(Router);

  protected readonly isLoading = signal<boolean>(false);

  protected readonly form = this.fb.nonNullable.group({
    email: [{value: '', disabled: true}, [Validators.required, Validators.email]],
    firstName: ['', [Validators.required, Validators.minLength(2)]],
    lastName: ['', [Validators.required, Validators.minLength(2)]]
  });

  public constructor() {
    effect(() => {
      const user = this.authStore.user();
      if (user) {
        this.form.patchValue({
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName
        });
      }
    });
  }

  protected save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();

      return;
    }

    this.isLoading.set(true);
    const data = this.form.getRawValue();

    this.userStore.updateMyProfile({
      data: data,
      onSuccess: () => {
        this.isLoading.set(false);
        this.router.navigate(['/profile']);
      }
    });
  }

  protected cancel(): void {
    this.router.navigate(['/profile']);
  }
}
