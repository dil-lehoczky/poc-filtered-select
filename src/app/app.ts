import { Component, inject, signal } from '@angular/core';
import { AppointeeService } from './appointee/appointee.service';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Appointee } from './appointee/appointee.model';
import { MatIconModule } from '@angular/material/icon';
import { JsonPipe } from '@angular/common';
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  finalize,
  of,
  Subject,
  switchMap,
} from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-root',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatIconModule,
    JsonPipe,
  ],
  templateUrl: './app.html',
  styleUrls: ['./app.css'],
})
export class App {
  readonly #appointees = inject(AppointeeService);
  readonly #fb = inject(FormBuilder);

  readonly form = this.#fb.group({
    appointee: this.#fb.control<Appointee | null>(null, { validators: [Validators.required] }),
  });

  readonly searchFilter = new Subject<string>();
  readonly appointeeResults = signal<Appointee[]>([]);
  readonly loadingAppointees = signal(false);
  readonly appointeeError = signal<string | undefined>(undefined);

  constructor() {
    this.searchFilter
      .pipe(
        debounceTime(200),
        distinctUntilChanged(),
        switchMap((searchTerm) => {
          this.appointeeError.set(undefined);
          this.loadingAppointees.set(true);

          return this.#appointees.search({ searchTerm }).pipe(
            catchError((error: HttpErrorResponse) => {
              this.appointeeError.set(error.message);
              return of([]);
            }),
            finalize(() => this.loadingAppointees.set(false)),
          );
        }),
      )
      .subscribe((response) => {
        this.appointeeResults.set(response);
      });
  }
}
