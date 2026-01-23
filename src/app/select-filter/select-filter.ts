import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  Injector,
  output,
} from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatOption, MatSelect, MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NgControl } from '@angular/forms';

@Component({
  selector: 'app-select-filter',
  imports: [MatFormFieldModule, MatSelectModule, MatInputModule, MatIconModule],
  template: `
    <div class="search-container">
      <mat-form-field>
        <input
          matInput
          aria-label="Search"
          placeholder="Search"
          (input)="filterChange.emit($event.target.value)"
          (keydown.space)="stopPropagation($event)"
        />
      </mat-form-field>
    </div>
    <div>
      <ng-content />
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: ``,
})
export class SelectFilter {
  readonly filterChange = output<string>();

  constructor() {
    const matSelect = inject(MatSelect, { optional: true });
    if (!matSelect) {
      throw new Error('<app-select-filter /> must be used inside a <mat-select />');
    }
    let lastSelectedOption: MatOption | MatOption[] = [];

    matSelect.valueChange.pipe(takeUntilDestroyed()).subscribe(() => {
      console.log(matSelect.selected);
      lastSelectedOption = matSelect.selected;
    });

    matSelect.openedChange.pipe(takeUntilDestroyed()).subscribe((open) => {
      // We need to restore the last selected option when
      // the user filtered it out, then closed the select panel.
      if (!open && matSelect.empty && lastSelectedOption) {
        const selection = Array.isArray(lastSelectedOption)
          ? lastSelectedOption
          : [lastSelectedOption];
        matSelect._selectionModel.select(...selection);
      }
    });

    const destroyRef = inject(DestroyRef);
    const injector = inject(Injector);

    afterNextRender({
      read: () => {
        const control = injector.get(NgControl, undefined, { optional: true });
        if (control) {
          control.valueChanges?.pipe(takeUntilDestroyed(destroyRef)).subscribe((value) => {
            console.log(value);
          });
        }
      },
    });
  }

  stopPropagation(event: Event) {
    // Pressing the Space would select an option in the <mat-select /> element.
    event.stopPropagation();
  }
}
