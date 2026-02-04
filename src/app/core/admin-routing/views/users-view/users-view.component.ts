import {Component, effect, inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {TableModule} from 'primeng/table';
import {ButtonModule} from 'primeng/button';
import {DialogModule} from 'primeng/dialog';
import {InputTextModule} from 'primeng/inputtext';
import {TagModule} from 'primeng/tag';
import {TooltipModule} from 'primeng/tooltip';
import {
  BackDashboardComponent
} from '@cinemabooking/core/admin-routing/components/back-dashboard/back-dashboard.component';
import {ConfirmationService} from 'primeng/api';
import {userStore} from '@cinemabooking/stores/user.store';
import {UpdateUserDto} from '@cinemabooking/interfaces/dto/update-user-dto';
import {UserForm} from '@cinemabooking/interfaces/form/user-form';
import {ConfirmDialog} from 'primeng/confirmdialog';
import {User} from '@cinemabooking/interfaces/models/user';

@Component({
  selector: 'app-users-view',
  imports: [
    ReactiveFormsModule,
    TableModule,
    ButtonModule,
    DialogModule,
    InputTextModule,
    TagModule,
    TooltipModule,
    BackDashboardComponent,
    ConfirmDialog,
  ],
  templateUrl: './users-view.component.html',
})
export class UsersViewComponent implements OnInit {
  protected readonly store = inject(userStore);
  private readonly fb = inject(FormBuilder);
  private readonly confirmationService = inject(ConfirmationService);

  protected readonly userForm: FormGroup<UserForm> = this.fb.nonNullable.group<UserForm>({
    firstName: this.fb.nonNullable.control('', Validators.required),
    lastName: this.fb.nonNullable.control('', Validators.required),
    email: this.fb.nonNullable.control('', [Validators.required, Validators.email]),
  });

  public constructor() {
    effect(() => {
      const user = this.store.selectedUser();
      const isOpen = this.store.isDialogOpen();

      if (user && isOpen) {
        this.userForm.patchValue({
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
        });
      }
    });
  }

  public ngOnInit(): void {
    this.store.loadUsers();
  }

  public openEditDialog(user: User): void {
    this.store.openEditDialog(user);
  }

  public saveUser(): void {
    const user = this.store.selectedUser();

    if (this.userForm.invalid || !user) {
      this.userForm.markAllAsTouched();

      return;
    }

    const dto = this.userForm.getRawValue() as UpdateUserDto;

    this.store.updateUser({
      id: user.id,
      data: dto,
    });
  }

  public toggleBlock(user: User): void {
    const action = user.isActive ? 'zablokować' : 'odblokować';

    this.confirmationService.confirm({
      message: `Czy na pewno chcesz ${action} użytkownika ${user.firstName} ${user.lastName}?`,
      header: 'Potwierdzenie',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Tak',
      rejectLabel: 'Nie',
      accept: () => this.store.toggleBlockUser(user),
    });
  }

  public promoteToAdmin(user: User): void {
    this.confirmationService.confirm({
      message: `Czy na pewno chcesz awansować użytkownika ${user.firstName} ${user.lastName} na administratora?`,
      header: 'Potwierdzenie awansu',
      icon: 'pi pi-user-plus',
      acceptLabel: 'Tak, awansuj',
      rejectLabel: 'Anuluj',
      accept: () => {
        this.store.promoteToAdmin(user.id);
        setTimeout(() => this.store.loadUsers(), 500);
      },
    });
  }

  public isAdmin(user: User): boolean {
    return user.roles.some((r) => {
      if (typeof r === 'string') {

        return r === 'ROLE_ADMIN';
      }

      return r.name === 'ROLE_ADMIN';
    });
  }

  public getRoleName(role: string | { name: string }): string {
    if (typeof role === 'string') {

      return role === 'ROLE_ADMIN' ? 'Admin' : 'Użytkownik';
    }

    return role.name === 'ROLE_ADMIN' ? 'Admin' : 'Użytkownik';
  }

  public isRoleAdmin(role: string | { name: string }): boolean {
    if (typeof role === 'string') {

      return role === 'ROLE_ADMIN';
    }

    return role.name === 'ROLE_ADMIN';
  }
}
