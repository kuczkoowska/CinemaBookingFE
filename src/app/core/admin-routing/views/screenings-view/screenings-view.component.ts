import {Component, inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators,} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {TableModule} from 'primeng/table';
import {ButtonModule} from 'primeng/button';
import {DialogModule} from 'primeng/dialog';
import {DatePickerModule} from 'primeng/datepicker';
import {SelectModule} from 'primeng/select';
import {InputTextModule} from 'primeng/inputtext';
import {TooltipModule} from 'primeng/tooltip';
import {
  BackDashboardComponent
} from '@cinemabooking/core/admin-routing/components/back-dashboard/back-dashboard.component';
import {movieStore} from '@cinemabooking/stores/movie.store';
import {CreateScreeningDto} from '@cinemabooking/interfaces/dto/create-screening-dto';
import {AdminScreeningsStore} from '@cinemabooking/stores/admin-screening.store';
import {ScreeningForm} from '@cinemabooking/interfaces/form/screening-form';

@Component({
  selector: 'app-screenings-view',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TableModule,
    ButtonModule,
    DialogModule,
    DatePickerModule,
    SelectModule,
    InputTextModule,
    TooltipModule,
    BackDashboardComponent,
    FormsModule,
  ],
  templateUrl: './screenings-view.component.html',
})
export class ScreeningsViewComponent implements OnInit {
  protected readonly store = inject(AdminScreeningsStore);
  protected readonly movieStore = inject(movieStore);
  private readonly fb = inject(FormBuilder);

  protected readonly screeningForm: FormGroup<ScreeningForm> = this.fb.group({
    movieId: [null as number | null, Validators.required],
    theaterRoomId: [null as number | null, Validators.required],
    startTime: [null as Date | null, Validators.required],
  });

  protected readonly theaterRooms = [
    {id: 1, name: 'Sala 1'},
    {id: 2, name: 'Sala 2'},
    {id: 3, name: 'Sala 3'},
  ];

  public ngOnInit(): void {
    this.movieStore.loadMovies();
    this.store.loadScreenings();
  }

  protected onDateChange(newDate: Date): void {
    this.store.setDate(newDate);
    this.store.loadScreenings();
  }

  protected openNewDialog(): void {
    this.screeningForm.reset({
      movieId: null,
      theaterRoomId: null,
      startTime: new Date(),
    });
    this.store.openDialog();
  }

  protected saveScreening(): void {
    if (this.screeningForm.invalid) {
      this.screeningForm.markAllAsTouched();
      return;
    }

    const {movieId, theaterRoomId, startTime} = this.screeningForm.getRawValue();

    const dto: CreateScreeningDto = {
      movieId: movieId!,
      theaterRoomId: theaterRoomId!,
      startTime: startTime!.toISOString(),
    };

    this.store.createScreening(dto);
  }
}
