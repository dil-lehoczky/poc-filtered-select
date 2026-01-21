import { Component, inject, signal } from '@angular/core';
import { AppointeeService } from './appointee/appointee.service';

@Component({
  selector: 'app-root',
  imports: [],
  template: ` <h1>Welcome to !</h1>
    <button (click)="test()">Test</button>`,
  styles: [],
})
export class App {
  readonly appointees = inject(AppointeeService);

  test() {
    this.appointees.search({ searchTerm: '' }).subscribe((response) => console.log(response));
  }
}
