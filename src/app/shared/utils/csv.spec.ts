import { toCsv } from './csv';

describe('toCsv', () => {
  it('writes semicolon-separated rows joined by CRLF', () => {
    expect(toCsv([['Datum', 'Ort'], ['05.11.2026', 'München']])).toBe('Datum;Ort\r\n05.11.2026;München');
  });

  it('writes numbers and keeps values as they are', () => {
    expect(toCsv([['Halle "A"', 3]])).toBe('Halle "A";3');
  });
});
