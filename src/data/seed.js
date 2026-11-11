// Početni (demo) podaci. Datumi pretplata računaju se u odnosu na današnji dan,
// pa nadzorna ploča ("istječu u 7 dana", "naplaćeno ovaj mjesec") uvijek ima smislene brojke.
import { danas, dodajDane } from '../utils/format.js';

export function pocetniKorisnici() {
  return [
    { sifra: 1, ime: 'Ivo', prezime: 'Primjerić', adresa: 'Demo ulica 10', mjesto: 'Osijek', telefon: '091 000 0001', email: 'ivo.primjeric@example.com', korisnickoIme: 'iprimjeric', ipAdresa: '192.168.10.25', macAdresa: 'A4:5E:60:00:00:01', modelOpreme: 'Ubiquiti NanoStation', datumPrikljucenja: '2026-01-01', status: 'Aktivan', napomena: '' },
    { sifra: 2, ime: 'Ana', prezime: 'Uzoritić', adresa: 'Probna ulica 5', mjesto: 'Osijek', telefon: '091 000 0002', email: '', korisnickoIme: 'auzoritic', ipAdresa: '192.168.10.26', macAdresa: 'A4:5E:60:00:00:02', modelOpreme: 'TP-Link CPE210', datumPrikljucenja: '2026-03-15', status: 'Aktivan', napomena: 'Plaća gotovinom.' },
    { sifra: 3, ime: 'Marko', prezime: 'Demić', adresa: 'Testna ulica 1', mjesto: 'Tenja', telefon: '091 000 0003', email: 'marko.demic@example.com', korisnickoIme: 'mdemic', ipAdresa: '192.168.10.27', macAdresa: 'A4:5E:60:00:00:03', modelOpreme: 'Ubiquiti NanoStation', datumPrikljucenja: '2025-06-10', status: 'Neaktivan', napomena: 'Odjavio uslugu.' },
  ];
}

export function pocetnePretplate() {
  const t = danas();
  const pretplata = (sifra, korisnik, paket, brzina, pocetakPrije, cijena, placanje) => {
    const datumPocetka = dodajDane(t, -pocetakPrije);
    return {
      sifra,
      korisnik,
      paket,
      brzina,
      datumPocetka,
      datumZavrsetka: dodajDane(datumPocetka, 30),
      trajanje: 1,
      cijena,
      datumPlacanja: placanje ? dodajDane(datumPocetka, placanje.dana) : '',
      placeniIznos: placanje ? cijena : '',
      nacinPlacanja: placanje ? placanje.nacin : '',
      placeno: Boolean(placanje),
    };
  };
  return [
    pretplata(1, 1, 'Internet 50 Mbps', '50 Mbps', 25, 20, { dana: 25, nacin: 'Gotovina' }),
    pretplata(2, 2, 'Internet 100 Mbps', '100 Mbps', 27, 25, null),
    pretplata(3, 3, 'Internet 50 Mbps', '50 Mbps', 90, 20, { dana: 2, nacin: 'Uplatnica' }),
  ];
}
