import {Component, effect, inject, OnInit} from '@angular/core';
import {User} from '@cinemabooking/interfaces/user';
import {CommonModule} from '@angular/common';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
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
import {UserStore} from '@cinemabooking/stores/user.store';
import {UpdateUserDto} from '@cinemabooking/interfaces/dto/update-user-dto';

@Component({
  selector: 'app-users-view',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TableModule,
    ButtonModule,
    DialogModule,
    InputTextModule,
    TagModule,
    TooltipModule,
    BackDashboardComponent,
  ],
  templateUrl: './users-view.component.html',
})
export class UsersViewComponent implements OnInit {
  protected readonly store = inject(UserStore);
  private readonly fb = inject(FormBuilder);
  private readonly confirmationService = inject(ConfirmationService);

  protected readonly userForm = this.fb.nonNullable.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
  });

  constructor() {
    effect(() => {
      const user = this.store.selectedUser();
      const isOpen = this.store.isDialogOpen();

      if (user && isOpen) {
        this.userForm.patchValue({
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email
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
      data: dto
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
      accept: () => this.store.toggleBlockUser(user)
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
      }
    });
  }

  public isAdmin(user: User): boolean {
    return user.roles.some((r) => r.name === 'ROLE_ADMIN');
  }
}
