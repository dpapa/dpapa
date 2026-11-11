import { useState } from 'react';
import KorisnikForma from '../components/KorisnikForma.jsx';
import { STATUSI_KORISNIKA } from '../data/constants.js';
import { idi } from '../hooks/useHashRoute.js';
import { punoIme } from '../utils/format.js';
import { brojPretplata } from '../utils/stats.js';

// Normalizira tekst za pretragu: mala slova i bez dijakritika
const normaliziraj = (tekst) => tekst.toLowerCase().replace(/đ/g, 'd').normalize('NFD').replace(/[̀-ͯ]/g, '');

// Popis korisnika s pretragom, filterom po statusu te dodavanjem, uređivanjem i brisanjem.
export default function Korisnici({ dijelovi, podaci, spremi, obrisi }) {
  const [uredi, setUredi] = useState(null); // korisnik koji se uređuje
  const [ime, setIme] = useState('');
  const [mjesto, setMjesto] = useState('');
  const [status, setStatus] = useState('');
  const [poruka, setPoruka] = useState('');
  const novi = dijelovi[1] === 'novi'; // adresa #/korisnici/novi otvara praznu formu

  const zatvori = () => {
    setUredi(null);
    if (novi) idi('/korisnici');
  };
  const spremiIZatvori = (korisnik) => {
    spremi('korisnici', korisnik);
    zatvori();
  };

  // Korisnika s pretplatama nije moguće obrisati (čuva se veza 1 : N)
  const pokusajObrisati = (k) => {
    if (brojPretplata(podaci.pretplate, k.sifra) > 0) {
      setPoruka('Korisnik ima pretplate. Prvo obrišite pretplate ili ga označite kao neaktivnog.');
      return;
    }
    if (window.confirm('Jeste li sigurni da želite obrisati zapis?')) {
      obrisi('korisnici', k.sifra);
      setPoruka('');
    }
  };

  const prikazani = podaci.korisnici.filter(
    (k) =>
      normaliziraj(punoIme(k)).includes(normaliziraj(ime.trim())) &&
      normaliziraj(`${k.adresa} ${k.mjesto}`).includes(normaliziraj(mjesto.trim())) &&
      (status === '' || k.status === status)
  );

  return (
    <>
      <div className="naslov-red">
        <h1># Korisnici</h1>
        <button className="gumb" onClick={() => { setUredi(null); idi('/korisnici/novi'); }}>&gt; + Novi korisnik</button>
      </div>

      {(novi || uredi) && (
        <KorisnikForma key={uredi?.sifra ?? 'novi'} korisnik={uredi} onSpremi={spremiIZatvori} onOdustani={zatvori} />
      )}
      {poruka && <p className="poruka" role="alert">{poruka}</p>}

      <div className="filteri">
        <input placeholder="Ime i prezime" aria-label="Pretraga po imenu" value={ime} onChange={(e) => setIme(e.target.value)} />
        <input placeholder="Adresa ili mjesto" aria-label="Pretraga po adresi" value={mjesto} onChange={(e) => setMjesto(e.target.value)} />
        <select aria-label="Filter po statusu" value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">Svi korisnici</option>
          {STATUSI_KORISNIKA.map((s) => <option key={s}>{s}</option>)}
        </select>
      </div>

      <div className="tablica-omot kutija">
        <table>
          <thead>
            <tr><th>// korisnik</th><th>// adresa</th><th>// telefon</th><th>// ip adresa</th><th>// status</th><th>// pretplata</th><th>//</th></tr>
          </thead>
          <tbody>
            {prikazani.map((k) => (
              <tr key={k.sifra}>
                <td><button className="link" onClick={() => idi(`/korisnik/${k.sifra}`)}>[{punoIme(k)}]</button></td>
                <td>{k.adresa}, {k.mjesto}</td>
                <td>{k.telefon}</td>
                <td>{k.ipAdresa || '–'}</td>
                <td><span className={`oznaka ${k.status === 'Aktivan' ? 'ok' : ''}`}>{k.status}</span></td>
                <td>{brojPretplata(podaci.pretplate, k.sifra)}</td>
                <td className="akcije">
                  <button className="link" onClick={() => { setUredi(k); setPoruka(''); if (novi) idi('/korisnici'); }}>[Uredi]</button>
                  <button className="link link--opasno" onClick={() => pokusajObrisati(k)}>[Obriši]</button>
                </td>
              </tr>
            ))}
            {prikazani.length === 0 && <tr><td colSpan="7" className="prazno">Nema korisnika za odabrani filter.</td></tr>}
          </tbody>
        </table>
      </div>
    </>
  );
}
