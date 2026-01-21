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

  readonly appointeeSearch = this.#appointees.createSearcher();
}
