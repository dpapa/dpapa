// Izračuni za nadzornu ploču i filtre pretplata.
import { danas, dodajDane } from './format.js';

// Pretplata je aktivna ako današnji dan pada unutar njezina razdoblja
export const jeAktivna = (p, t = danas()) => p.datumPocetka <= t && t <= p.datumZavrsetka;

// Istječe unutar zadanog broja dana (uključujući danas)
export const istjece = (p, dana = 7, t = danas()) => p.datumZavrsetka >= t && p.datumZavrsetka <= dodajDane(t, dana);

export function statistika({ korisnici, pretplate }) {
  const t = danas();
  const mjesec = t.slice(0, 7);
  return {
    korisnika: korisnici.length,
    aktivnih: korisnici.filter((k) => k.status === 'Aktivan').length,
    neaktivnih: korisnici.filter((k) => k.status === 'Neaktivan').length,
    aktivnihPretplata: pretplate.filter((p) => jeAktivna(p, t)).length,
    neplacenih: pretplate.filter((p) => !p.placeno).length,
    naplacenoOvajMjesec: pretplate
      .filter((p) => p.placeno && p.datumPlacanja.startsWith(mjesec))
      .reduce((zbroj, p) => zbroj + Number(p.placeniIznos || 0), 0),
  };
}

export const brojPretplata = (pretplate, korisnikSifra) => pretplate.filter((p) => p.korisnik === korisnikSifra).length;

export function filtrirajPretplate(pretplate, filter) {
  switch (filter) {
    case 'neplacene': return pretplate.filter((p) => !p.placeno);
    case 'istjecu': return pretplate.filter((p) => istjece(p));
    case 'aktivne': return pretplate.filter((p) => jeAktivna(p));
    default: return pretplate;
  }
}
