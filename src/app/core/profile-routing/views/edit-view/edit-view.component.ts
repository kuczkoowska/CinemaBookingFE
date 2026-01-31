import {Component, inject, OnInit} from '@angular/core';
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
export class EditViewComponent implements OnInit {
  private fb = inject(FormBuilder);
  private auth = inject(AuthStore);
  private userStore = inject(UserStore);
  private router = inject(Router);

  public isLoading = false;

  public form = this.fb.group({
    email: [{value: '', disabled: true}, [Validators.required, Validators.email]],
    firstName: ['', Validators.required],
    lastName: ['', Validators.required]
  });

  ngOnInit() {
    const user = this.auth.user();
    if (user) {
      this.form.patchValue({
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName
      });
    }
  }

  save() {
    if (this.form.invalid) return;

    const data = this.form.getRawValue();

    this.userStore.updateMyProfile({
      data: data,
      onSuccess: () => {
        this.router.navigate(['/profile']);
      }
    });
  }

  cancel() {
    this.router.navigate(['/profile']);
  }
}
