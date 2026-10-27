import { Directive, inject, TemplateRef } from '@angular/core';

export type TableRowContext = {
  $implicit: unknown;
  /** Whether this row's details are open. */
  expanded: boolean;
  /** Opens or closes this row's details. */
  toggle: () => void;
};

/** Marks the projected template that renders one row: `<ng-template tableRow let-row let-expanded="expanded" let-toggle="toggle">`. */
@Directive({ selector: 'ng-template[tableRow]' })
export class TableRow {
  readonly template = inject<TemplateRef<TableRowContext>>(TemplateRef);
}

@Directive({ selector: 'ng-template[tableCard]' })
export class TableCard {
  readonly template = inject<TemplateRef<TableRowContext>>(TemplateRef);
}

@Directive({ selector: 'ng-template[tableDetail]' })
export class TableDetail {
  readonly template = inject<TemplateRef<{ $implicit: unknown }>>(TemplateRef);
}
