import { useState } from 'react';
import PretplataForma from '../components/PretplataForma.jsx';
import { FILTERI_PRETPLATA, } from '../data/constants.js';
import { idi } from '../hooks/useHashRoute.js';
import { danas, formatirajDatum, formatirajIznos, formatirajRazdoblje, punoIme } from '../utils/format.js';
import { filtrirajPretplate } from '../utils/stats.js';

// Popis pretplata s filterom (adresa #/pretplate/neplacene, /istjecu, /aktivne), evidencijom plaćanja i CRUD-om.
export default function Pretplate({ dijelovi, podaci, spremi, obrisi }) {
  const [uredi, setUredi] = useState(null);
  const nova = dijelovi[1] === 'nova'; // adresa #/pretplate/nova otvara praznu formu
  const filter = FILTERI_PRETPLATA.some((f) => f.id === dijelovi[1]) ? dijelovi[1] : 'sve';

  const zatvori = () => {
    setUredi(null);
    if (nova) idi('/pretplate');
  };
  const spremiIZatvori = (pretplata) => {
    spremi('pretplate', pretplata);
    zatvori();
  };

  // Brza evidencija plaćanja: danas, puni iznos pretplate, gotovina
  const evidentirajPlacanje = (p) =>
    spremi('pretplate', { ...p, placeno: true, datumPlacanja: danas(), placeniIznos: p.cijena, nacinPlacanja: 'Gotovina' });

  const prikazane = filtrirajPretplate(podaci.pretplate, filter).sort((a, b) => b.datumPocetka.localeCompare(a.datumPocetka));
  const korisnik = (sifra) => podaci.korisnici.find((k) => k.sifra === sifra);

  return (
    <>
      <div className="naslov-red">
        <h1># Pretplate</h1>
        <button className="gumb" onClick={() => { setUredi(null); idi('/pretplate/nova'); }}>&gt; + Nova pretplata</button>
      </div>

      {(nova || uredi) && (
        <PretplataForma
          key={uredi?.sifra ?? 'nova'}
          pretplata={uredi}
          korisnici={podaci.korisnici}
          onSpremi={spremiIZatvori}
          onOdustani={zatvori}
        />
      )}

      <div className="filteri">
        <select
          aria-label="Filter pretplata"
          value={filter}
          onChange={(e) => idi(e.target.value === 'sve' ? '/pretplate' : `/pretplate/${e.target.value}`)}
        >
          {FILTERI_PRETPLATA.map((f) => <option key={f.id} value={f.id}>{f.naziv}</option>)}
        </select>
      </div>

      <div className="tablica-omot kutija">
        <table>
          <thead>
            <tr><th>// korisnik</th><th>// paket</th><th>// razdoblje</th><th>// cijena</th><th>// status</th><th>// plaćanje</th><th>//</th></tr>
          </thead>
          <tbody>
            {prikazane.map((p) => (
              <tr key={p.sifra}>
                <td><button className="link" onClick={() => idi(`/korisnik/${p.korisnik}`)}>[{punoIme(korisnik(p.korisnik))}]</button></td>
                <td>{p.paket}</td>
                <td>{formatirajRazdoblje(p)}</td>
                <td>{formatirajIznos(p.cijena)}</td>
                <td><span className={`oznaka ${p.placeno ? 'ok' : ''}`}>{p.placeno ? 'Plaćeno' : 'Nije plaćeno'}</span></td>
                <td>
                  {p.placeno
                    ? formatirajDatum(p.datumPlacanja)
                    : <button className="link" onClick={() => evidentirajPlacanje(p)}>Evidentiraj plaćanje</button>}
                </td>
                <td className="akcije">
                  <button className="link" onClick={() => { setUredi(p); if (nova) idi('/pretplate'); }}>[Uredi]</button>
                  <button
                    className="link link--opasno"
                    onClick={() => window.confirm('Jeste li sigurni da želite obrisati zapis?') && obrisi('pretplate', p.sifra)}
                  >
                    [Obriši]
                  </button>
                </td>
              </tr>
            ))}
            {prikazane.length === 0 && <tr><td colSpan="7" className="prazno">Nema pretplata za odabrani filter.</td></tr>}
          </tbody>
        </table>
      </div>
    </>
  );
}
