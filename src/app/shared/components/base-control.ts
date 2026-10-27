import { Directive, DoCheck, inject, input, Signal, signal } from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';

/**
 * What the shared form fields have in common: they work with `formControlName`, `[formControl]`
 * and `[(ngModel)]`, and show an error message once the field was touched.
 */
@Directive()
export abstract class BaseControl<T> implements ControlValueAccessor, DoCheck {
  /** Message per validation error, e.g. `{ required: 'Ort ist erforderlich.' }`. */
  readonly errorMessages = input<Record<string, string>>({});

  protected readonly value = signal<T | null>(null);
  protected readonly errorMessage = signal<string | null>(null);
  protected readonly disabled = signal(false);

  private readonly ngControl = inject(NgControl, { self: true, optional: true });
  private errorState = false;
  private onChange: (value: T | null) => void = () => {};
  protected onTouched: () => void = () => {};

  /** Lets the inner Material control show the outer control's error state. */
  protected readonly errorStateMatcher: ErrorStateMatcher = { isErrorState: () => this.errorState };
  /** The inner MatInput or MatSelect; set by fields that show errors. */
  protected readonly errorField: Signal<{ updateErrorState(): void } | undefined> = signal(undefined);

  constructor() {
    if (this.ngControl) {
      this.ngControl.valueAccessor = this;
    }
  }

  // Form state is not a signal, so it is read on every check (e.g. after markAllAsTouched).
  // The inner control has no form control of its own, so it is told to update its error state.
  ngDoCheck(): void {
    const errorState = !!this.ngControl?.invalid && !!this.ngControl.touched;
    if (errorState !== this.errorState) {
      this.errorState = errorState;
      this.errorField()?.updateErrorState();
    }
    const error = errorState ? Object.keys(this.ngControl?.errors ?? {}).find((key) => key in this.errorMessages()) : undefined;
    this.errorMessage.set(error ? this.errorMessages()[error]! : null);
  }

  writeValue(value: T | null): void {
    this.value.set(value);
  }

  registerOnChange(onChange: (value: T | null) => void): void {
    this.onChange = onChange;
  }

  registerOnTouched(onTouched: () => void): void {
    this.onTouched = onTouched;
  }

  setDisabledState(disabled: boolean): void {
    this.disabled.set(disabled);
  }

  /** Called by the component when the user picks a new value. */
  protected update(value: T | null): void {
    this.value.set(value);
    this.onChange(value);
  }
}
