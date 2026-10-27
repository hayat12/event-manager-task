export type TableColumn = {
  key: string;
  label: string;
  sortable?: boolean;
  /** Alignment of a non-sortable column's header; sortable headers stay left-aligned. */
  align?: 'start' | 'center' | 'end';
  /** Show the label to screen readers only, e.g. for an actions column. */
  hideLabel?: boolean;
};

/** Totals for one group, shown as a header row where the group starts. */
export type TableGroup = {
  key: string;
  label: string;
  summary: string;
};

export type TableView = 'list' | 'card';
