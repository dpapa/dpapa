import { idi } from '../hooks/useHashRoute.js';
import { formatirajDatum, formatirajIznos, formatirajRazdoblje, punoIme } from '../utils/format.js';

// Detalji korisnika: podaci, zbroj plaćenog i neplaćenog te povijest njegovih pretplata.
export default function Korisnik({ sifra, podaci }) {
  const k = podaci.korisnici.find((x) => x.sifra === Number(sifra));

  if (!k) {
    return (
      <>
        <button className="link" onClick={() => idi('/korisnici')}>← Korisnici</button>
        <p className="poruka">Korisnik ne postoji.</p>
      </>
    );
  }

  const pretplate = podaci.pretplate
    .filter((p) => p.korisnik === k.sifra)
    .sort((a, b) => b.datumPocetka.localeCompare(a.datumPocetka));
  const ukupnoPlaceno = pretplate.filter((p) => p.placeno).reduce((zbroj, p) => zbroj + Number(p.placeniIznos || 0), 0);
  const neplaceno = pretplate.filter((p) => !p.placeno).reduce((zbroj, p) => zbroj + Number(p.cijena), 0);

  const podaciKorisnika = [
    ['Adresa', `${k.adresa}, ${k.mjesto}`],
    ['Telefon', k.telefon],
    ['E-mail', k.email || '–'],
    ['Korisničko ime', k.korisnickoIme],
    ['IP adresa', k.ipAdresa || '–'],
    ['MAC adresa', k.macAdresa || '–'],
    ['Oprema', k.modelOpreme || '–'],
    ['Priključen', formatirajDatum(k.datumPrikljucenja)],
  ];

  return (
    <>
      <button className="link" onClick={() => idi('/korisnici')}>← Korisnici</button>
      <div className="naslov-red">
        <h1>{punoIme(k)}</h1>
        <span className={`oznaka ${k.status === 'Aktivan' ? 'ok' : ''}`}>{k.status}</span>
      </div>

      <section className="kutija detalji">
        <dl>
          {podaciKorisnika.map(([naziv, vrijednost]) => (
            <div key={naziv}>
              <dt>{naziv}</dt>
              <dd>{vrijednost}</dd>
            </div>
          ))}
        </dl>
        {k.napomena && <p className="muted">{k.napomena}</p>}
      </section>

      <section className="statistika-mreza statistika-mreza--uska">
        <div className="kutija statistika"><strong>{formatirajIznos(ukupnoPlaceno)}</strong><span>Ukupno plaćeno</span></div>
        <div className="kutija statistika"><strong>{formatirajIznos(neplaceno)}</strong><span>Neplaćeno</span></div>
      </section>

      <h2>## Povijest pretplata</h2>
      <div className="tablica-omot kutija">
        <table>
          <thead><tr><th>// razdoblje</th><th>// paket</th><th>// cijena</th><th>// plaćanje</th><th>// status</th></tr></thead>
          <tbody>
            {pretplate.map((p) => (
              <tr key={p.sifra}>
                <td>{formatirajRazdoblje(p)}</td>
                <td>{p.paket}</td>
                <td>{formatirajIznos(p.cijena)}</td>
                <td>{p.placeno ? `${formatirajDatum(p.datumPlacanja)} (${p.nacinPlacanja || '–'})` : '–'}</td>
                <td><span className={`oznaka ${p.placeno ? 'ok' : ''}`}>{p.placeno ? 'Plaćeno' : 'Nije plaćeno'}</span></td>
              </tr>
            ))}
            {pretplate.length === 0 && <tr><td colSpan="5" className="prazno">Korisnik nema pretplata.</td></tr>}
          </tbody>
        </table>
      </div>
    </>
  );
}
