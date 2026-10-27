import { GermanDatePipe } from './german-date.pipe';

describe('GermanDatePipe', () => {
  const pipe = new GermanDatePipe();

  it('shows an ISO date as DD.MM.YYYY', () => {
    expect(pipe.transform('2026-11-05')).toBe('05.11.2026');
  });

  it('shows nothing for a missing date', () => {
    expect(pipe.transform(null)).toBe('');
    expect(pipe.transform(undefined)).toBe('');
  });
});
