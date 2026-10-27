export type SortDirection = 'asc' | 'desc';

export type Sort<TField extends string> = {
  active: TField;
  direction: SortDirection;
};
