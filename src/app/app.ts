import { afterNextRender, Component, inject, WritableSignal } from '@angular/core';
import { AppointeeService } from './appointee/appointee.service';
import {
  AbstractControl,
  FormBuilder,
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
import { SelectFilter } from './select-filter/select-filter';
import { createSearcher } from './create-searcher';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { startWith } from 'rxjs';

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
    SelectFilter,
  ],
  templateUrl: './app.html',
  styleUrls: ['./app.css'],
})
export class App {
  readonly #appointees = inject(AppointeeService);
  readonly #fb = inject(FormBuilder);

  fos(a: any) {
    console.log(a);
  }

  readonly form = this.#fb.group({
    appointee: this.#fb.control<Appointee | null>(null, { validators: [Validators.required] }),
  });

  readonly appointeeSearch = createSearcher({
    loader: ({ searchTerm }) => this.#appointees.search({ searchTerm }),
    identity: (option) => option.id,
  });

  constructor() {
    const { appointee } = this.form.controls;
    syncSignalWithFormControl(appointee, this.appointeeSearch.selected);
  }

  updateProgrammatically() {
    this.form.setValue({
      appointee: {
        id: 'bca',
        name: 'David Bate',
        jobTitle: 'Director',
      },
    });
  }
}

function syncSignalWithFormControl<T>(
  control: AbstractControl<T>,
  signal: WritableSignal<T>,
): void {
  control.valueChanges.pipe(takeUntilDestroyed(), startWith(control.value)).subscribe((value) => {
    signal.set(value);
  });
}
