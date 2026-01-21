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

@Component({
  selector: 'app-root',
  imports: [FormsModule, ReactiveFormsModule, MatFormFieldModule, MatSelectModule, MatInputModule],
  templateUrl: './app.html',
  styles: [],
})
export class App {
  readonly #appointees = inject(AppointeeService);
  readonly #fb = inject(FormBuilder);

  readonly form = this.#fb.group({
    appointee: this.#fb.control<Appointee | null>(null, { validators: [Validators.required] }),
  });

  readonly appointeeResults = signal<Appointee[]>([]);
  constructor() {
    this.#appointees.search({ searchTerm: '' }).subscribe((response) => {
      this.appointeeResults.set(response);
    });
  }
}
