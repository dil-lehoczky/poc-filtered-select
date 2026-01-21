import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { assertInInjectionContext, DestroyRef, inject, Injectable, signal } from '@angular/core';

import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  finalize,
  map,
  switchMap,
} from 'rxjs/operators';
import {
  Appointee,
  AppointeeSearchRequestBody,
  appointeeSearchResponseSchema,
} from './appointee.model';
import { of, Subject } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

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

  createSearcher() {
    assertInInjectionContext(this.createSearcher);

    const destroyRef = inject(DestroyRef);
    const searchTerm$ = new Subject<string>();
    const value = signal<Appointee[]>([]);
    const loading = signal(false);
    const error = signal<string | undefined>(undefined);

    function updateSearchTerm(value: string) {
      searchTerm$.next(value);
    }

    searchTerm$
      .pipe(
        takeUntilDestroyed(destroyRef),
        debounceTime(200),
        distinctUntilChanged(),
        switchMap((searchTerm) => {
          loading.set(true);
          error.set(undefined);

          return this.search({ searchTerm }).pipe(
            catchError((searchError: HttpErrorResponse) => {
              error.set(searchError.message);
              return of([]);
            }),
            finalize(() => loading.set(false)),
          );
        }),
      )
      .subscribe((response) => {
        value.set(response);
      });

    return {
      value: value.asReadonly(),
      loading: loading.asReadonly(),
      error: error.asReadonly(),
      updateSearchTerm,
    };
  }
}
