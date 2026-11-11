// Validacije formi. Svaka vraća objekt s greškama; prazan objekt = sve u redu.

const OBAVEZNO = 'Obavezno polje';
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const IP = /^(25[0-5]|2[0-4]\d|1?\d?\d)(\.(25[0-5]|2[0-4]\d|1?\d?\d)){3}$/;
const MAC = /^([0-9A-Fa-f]{2}:){5}[0-9A-Fa-f]{2}$/;

export function validirajKorisnika(k) {
  const g = {};
  if (k.ime.trim() === '') g.ime = OBAVEZNO;
  if (k.prezime.trim() === '') g.prezime = OBAVEZNO;
  if (k.adresa.trim() === '') g.adresa = OBAVEZNO;
  if (k.telefon.trim() === '') g.telefon = OBAVEZNO;
  if (k.korisnickoIme.trim() === '') g.korisnickoIme = OBAVEZNO;
  if (k.email.trim() !== '' && !EMAIL.test(k.email.trim())) g.email = 'Unesite ispravan e-mail.';
  if (k.ipAdresa.trim() !== '' && !IP.test(k.ipAdresa.trim())) g.ipAdresa = 'Unesite ispravnu IP adresu (npr. 192.168.10.25).';
  if (k.macAdresa.trim() !== '' && !MAC.test(k.macAdresa.trim())) g.macAdresa = 'MAC adresa mora biti oblika A4:5E:60:12:34:56.';
  return g;
}

export function validirajPretplatu(p) {
  const g = {};
  if (p.korisnik === '') g.korisnik = OBAVEZNO;
  if (p.paket.trim() === '') g.paket = OBAVEZNO;
  if (p.brzina.trim() === '') g.brzina = OBAVEZNO;
  if (!p.datumPocetka) g.datumPocetka = OBAVEZNO;
  if (!p.datumZavrsetka) g.datumZavrsetka = OBAVEZNO;
  else if (p.datumPocetka && p.datumZavrsetka <= p.datumPocetka) g.datumZavrsetka = 'Završetak mora biti nakon početka.';
  if (!Number.isInteger(Number(p.trajanje)) || Number(p.trajanje) < 1) g.trajanje = 'Trajanje je cijeli broj mjeseci, najmanje 1.';
  if (!(Number(p.cijena) > 0)) g.cijena = 'Cijena mora biti veća od 0.';
  if (p.placeno) {
    if (!p.datumPlacanja) g.datumPlacanja = 'Unesite datum plaćanja.';
    if (p.placeniIznos === '' || !(Number(p.placeniIznos) > 0)) g.placeniIznos = 'Unesite plaćeni iznos.';
  }
  return g;
}
