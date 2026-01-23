import { Observable, of, Subject } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  finalize,
  switchMap,
} from 'rxjs/operators';
import { assertInInjectionContext, effect, signal, untracked } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

type Nullable<T> = T | undefined | null;

export interface CreateSearcherParams<T> {
  loader: (params: { searchTerm: string }) => Observable<T[]>;
  identity: (option: T) => unknown;
}

export function createSearcher<T>({ loader, identity }: CreateSearcherParams<T>) {
  assertInInjectionContext(createSearcher);

  const searchTerm$ = new Subject<string>();
  const value = signal<T[]>([]);
  const loading = signal(false);
  const error = signal<string | undefined>(undefined);
  const selected = signal<Nullable<T>>(undefined);

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
            return of<T[]>([]);
          }),
          finalize(() => loading.set(false)),
        );
      }),
    )
    .subscribe((response) => {
      value.set(putSelectedFirst(selected(), response));
    });

  effect(() => {
    const selected_ = selected();
    const options = untracked(value);
    value.set(putSelectedFirst(selected_, options));
  });

  function putSelectedFirst(selected: Nullable<T>, options: T[]): T[] {
    if (!selected) {
      return options;
    }
    const withoutSelected = options.filter((option) => {
      return identity(option) !== identity(selected);
    });
    return [selected, ...withoutSelected];
  }

  return {
    value: value.asReadonly(),
    loading: loading.asReadonly(),
    error: error.asReadonly(),
    selected,
    updateSearchTerm: (value: string) => searchTerm$.next(value),
    comparator: (a: T, b: T) => identity(a) === identity(b),
  };
}
