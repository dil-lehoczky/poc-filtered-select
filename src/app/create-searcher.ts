import { Observable, of, Subject } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  finalize,
  switchMap,
} from 'rxjs/operators';
import { assertInInjectionContext, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

export interface CreateSearcherParams<T> {
  loader: (params: { searchTerm: string }) => Observable<T[]>;
  comparator: (a: T, b: T) => boolean;
}

export function createSearcher<T>({ loader, comparator }: CreateSearcherParams<T>) {
  assertInInjectionContext(createSearcher);

  const searchTerm$ = new Subject<string>();
  const value = signal<T[]>([]);
  const loading = signal(false);
  const error = signal<string | undefined>(undefined);

  searchTerm$
    .pipe(
      takeUntilDestroyed(),
      debounceTime(200),
      distinctUntilChanged(),
      switchMap((searchTerm) => {
        loading.set(true);
        error.set(undefined);

        return loader({ searchTerm }).pipe(
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
    updateSearchTerm: (value: string) => searchTerm$.next(value),
    comparator,
  };
}
