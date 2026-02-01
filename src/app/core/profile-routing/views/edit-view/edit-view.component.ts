import {Component, effect, inject} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {userStore} from '@cinemabooking/stores/user.store';
import {Button} from 'primeng/button';
import {InputText} from 'primeng/inputtext';
import {AuthStore} from '@cinemabooking/stores/auth.store';
import {ProfileEditForm} from '@cinemabooking/interfaces/form/profile-edit-form';

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
  private readonly fb: FormBuilder = inject(FormBuilder);
  private readonly authStore = inject(AuthStore);
  protected readonly userStore = inject(userStore);
  private readonly router: Router = inject(Router);


  protected readonly form: FormGroup<ProfileEditForm> = this.fb.nonNullable.group({
    email: [{value: '', disabled: true}, [Validators.required, Validators.email]],
    firstName: ['', [Validators.required, Validators.minLength(2)]],
    lastName: ['', [Validators.required, Validators.minLength(2)]]
  });

  public constructor() {
    effect((): void => {
      const user = this.authStore.user();
      if (user) {
        this.form.patchValue(user);
      }
    });
  }

  protected save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();

      return;
    }
    this.userStore.updateMyProfile(this.form.getRawValue());
  }

  protected cancel(): void {
    this.router.navigate(['/profile']);
  }
}
