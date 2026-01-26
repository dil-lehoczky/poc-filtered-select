import { ChangeDetectionStrategy, Component, inject, output } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatSelect } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-select-filter',
  imports: [MatFormFieldModule, MatInputModule, MatIconModule],
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
  }

  stopPropagation(event: Event) {
    // Pressing the Space would select an option in the <mat-select /> element.
    event.stopPropagation();
  }
}
