import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { map } from 'rxjs/operators';
import { AppointeeSearchRequestBody, appointeeSearchResponseSchema } from './appointee.model';

@Injectable({
  providedIn: 'root',
})
export class AppointeeService {
  readonly #http = inject(HttpClient);

  search(body: AppointeeSearchRequestBody) {
    return this.#http
      .post('/appointee-search', body)
      .pipe(map((response) => appointeeSearchResponseSchema.parse(response)));
  }
}
