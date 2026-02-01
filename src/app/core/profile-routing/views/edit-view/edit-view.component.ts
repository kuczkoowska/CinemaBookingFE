import {Component, effect, inject} from '@angular/core';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {UserStore} from '@cinemabooking/stores/user.store';
import {Button} from 'primeng/button';
import {InputText} from 'primeng/inputtext';
import {AuthStore} from '@cinemabooking/stores/auth.store';

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
  protected readonly userStore = inject(UserStore);
  private readonly router: Router = inject(Router);


  protected readonly form = this.fb.nonNullable.group({
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
