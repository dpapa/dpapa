import { useEffect, useReducer } from 'react';
import { pocetniKorisnici, pocetnePretplate } from '../data/seed.js';
import { reducer } from '../data/reducer.js';

const KLJUC_KORISNICI = 'nw_korisnici';
const KLJUC_PRETPLATE = 'nw_pretplate';

// Učitava popis iz localStorage-a; ako ga nema ili je neispravan, koristi početne podatke
function ucitajPopis(kljuc, pocetni) {
  try {
    const spremljeno = localStorage.getItem(kljuc);
    return spremljeno ? JSON.parse(spremljeno) : pocetni();
  } catch {
    return pocetni();
  }
}

const ucitaj = () => ({
  korisnici: ucitajPopis(KLJUC_KORISNICI, pocetniKorisnici),
  pretplate: ucitajPopis(KLJUC_PRETPLATE, pocetnePretplate),
});

// Hook koji drži sve podatke aplikacije i nudi akcije spremi/obrisi.
export function useStore() {
  const [podaci, dispatch] = useReducer(reducer, null, ucitaj);

  useEffect(() => {
    try {
      localStorage.setItem(KLJUC_KORISNICI, JSON.stringify(podaci.korisnici));
      localStorage.setItem(KLJUC_PRETPLATE, JSON.stringify(podaci.pretplate));
    } catch {
      /* bez trajne pohrane aplikacija i dalje radi */
    }
  }, [podaci]);

  const spremi = (kolekcija, stavka) => dispatch({ tip: 'SPREMI', kolekcija, stavka });
  const obrisi = (kolekcija, sifra) => dispatch({ tip: 'OBRISI', kolekcija, sifra });

  return { podaci, spremi, obrisi };
}
