import { Observable, of, Subject } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  finalize,
  switchMap,
  tap,
} from 'rxjs/operators';
import { assertInInjectionContext, computed, effect, signal, untracked } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

type Nullable<T> = T | undefined | null;

export interface CreateSearcherParams<T> {
  loader: (params: { searchTerm: string }) => Observable<T[]>;
  identity: (option: T) => unknown;
}

export function createSearcher<T>({ loader, identity }: CreateSearcherParams<T>) {
  assertInInjectionContext(createSearcher);

  const searchTerm$ = new Subject<string>();
  const values = signal<T[]>([]);
  const loading = signal(false);
  const error = signal<string | undefined>(undefined);
  const selected = signal<Nullable<T>>(undefined);

  const isEmpty = computed(() => values().length === 0);
  const searchTermEmpty = signal(true);
  const noItemsFound = computed(() => {
    return isEmpty() && !searchTermEmpty();
  });

  searchTerm$
    .pipe(
      takeUntilDestroyed(),
      debounceTime(200),
      distinctUntilChanged(),
      tap((searchTerm) => searchTermEmpty.set(!searchTerm)),
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
      values.set(putSelectedFirst(selected(), response));
    });

  effect(() => {
    const selected_ = selected();
    const options = untracked(values);
    values.set(putSelectedFirst(selected_, options));
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
    values: values.asReadonly(),
    loading: loading.asReadonly(),
    error: error.asReadonly(),
    selected,
    isEmpty,
    noItemsFound,
    updateSearchTerm: (value: string) => searchTerm$.next(value),
    comparator: (a: T, b: T) => identity(a) === identity(b),
  };
}
