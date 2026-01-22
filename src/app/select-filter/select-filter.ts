import { Component, output } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-select-filter',
  imports: [MatFormFieldModule, MatSelectModule, MatInputModule, MatIconModule],
  template: `
    <div class="search-container">
      <mat-form-field>
        <input matInput placeholder="Search" (input)="filterChange.emit($event.target.value)" />
      </mat-form-field>
    </div>
    <div>
      <ng-content />
    </div>
  `,
  styles: ``,
})
export class SelectFilter {
  readonly filterChange = output<string>();
}
