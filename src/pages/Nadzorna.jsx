import { idi } from '../hooks/useHashRoute.js';
import { dodajDane, danas, formatirajDatum, formatirajIznos, formatirajRazdoblje, punoIme } from '../utils/format.js';
import { istjece, statistika } from '../utils/stats.js';

// Nadzorna ploča: brojke, prečaci te popisi pretplata koje istječu, neplaćenih pretplata i zadnjih plaćanja.
export default function Nadzorna({ podaci }) {
  const s = statistika(podaci);
  const korisnik = (sifra) => podaci.korisnici.find((k) => k.sifra === sifra);
  const poveznica = (p) => (
    <button className="link" onClick={() => idi(`/korisnik/${p.korisnik}`)}>[{punoIme(korisnik(p.korisnik))}]</button>
  );
  const oznaka = (p) => <span className={`oznaka ${p.placeno ? 'ok' : ''}`}>{p.placeno ? 'Plaćeno' : 'Nije plaćeno'}</span>;

  const brojke = [
    { broj: s.korisnika, naziv: 'Korisnika' },
    { broj: s.aktivnih, naziv: 'Aktivnih' },
    { broj: s.neaktivnih, naziv: 'Neaktivnih' },
    { broj: s.aktivnihPretplata, naziv: 'Aktivnih pretplata' },
    { broj: s.neplacenih, naziv: 'Neplaćenih pretplata' },
    { broj: formatirajIznos(s.naplacenoOvajMjesec), naziv: 'Naplaćeno ovaj mjesec' },
  ];

  const istjecu = podaci.pretplate.filter((p) => istjece(p)).sort((a, b) => a.datumZavrsetka.localeCompare(b.datumZavrsetka));
  const neplacene = podaci.pretplate.filter((p) => !p.placeno);
  const placanja = podaci.pretplate.filter((p) => p.placeno).sort((a, b) => b.datumPlacanja.localeCompare(a.datumPlacanja)).slice(0, 5);

  return (
    <>
      <h1># Nadzorna ploča</h1>
      <p>Danas: {formatirajDatum(danas())}</p>

      <section className="statistika-mreza">
        {brojke.map((b) => (
          <div className="kutija statistika" key={b.naziv}>
            <strong>{b.broj}</strong>
            <span>{b.naziv}</span>
          </div>
        ))}
      </section>

      <div className="gumbi">
        <button className="gumb" onClick={() => idi('/korisnici/novi')}>&gt; Dodaj korisnika</button>
        <button className="gumb" onClick={() => idi('/pretplate/nova')}>&gt; Dodaj pretplatu</button>
        <button className="gumb" onClick={() => idi('/pretplate/neplacene')}>&gt; Evidentiraj plaćanje</button>
        <button className="gumb gumb--tih" onClick={() => idi('/pretplate/neplacene')}>&gt; Prikaži neplaćene</button>
        <button className="gumb gumb--tih" onClick={() => idi('/korisnici')}>&gt; Prikaži sve korisnike</button>
      </div>

      <h2>## Pretplate koje istječu u sljedećih 7 dana</h2>
      <div className="tablica-omot kutija">
        <table>
          <thead><tr><th>// korisnik</th><th>// paket</th><th>// datum isteka</th><th>// status</th></tr></thead>
          <tbody>
            {istjecu.map((p) => (
              <tr key={p.sifra}><td>{poveznica(p)}</td><td>{p.paket}</td><td>{formatirajDatum(p.datumZavrsetka)}</td><td>{oznaka(p)}</td></tr>
            ))}
            {istjecu.length === 0 && <tr><td colSpan="4" className="prazno">Nema pretplata koje istječu.</td></tr>}
          </tbody>
        </table>
      </div>

      <h2>## Neplaćene pretplate</h2>
      <div className="tablica-omot kutija">
        <table>
          <thead><tr><th>// korisnik</th><th>// razdoblje</th><th>// iznos</th><th>// status</th></tr></thead>
          <tbody>
            {neplacene.map((p) => (
              <tr key={p.sifra}><td>{poveznica(p)}</td><td>{formatirajRazdoblje(p)}</td><td>{formatirajIznos(p.cijena)}</td><td>{oznaka(p)}</td></tr>
            ))}
            {neplacene.length === 0 && <tr><td colSpan="4" className="prazno">Sve pretplate su plaćene.</td></tr>}
          </tbody>
        </table>
      </div>

      <h2>## Posljednja plaćanja</h2>
      <div className="tablica-omot kutija">
        <table>
          <thead><tr><th>// datum</th><th>// korisnik</th><th>// iznos</th><th>// način</th></tr></thead>
          <tbody>
            {placanja.map((p) => (
              <tr key={p.sifra}><td>{formatirajDatum(p.datumPlacanja)}</td><td>{poveznica(p)}</td><td>{formatirajIznos(p.placeniIznos)}</td><td>{p.nacinPlacanja || '–'}</td></tr>
            ))}
            {placanja.length === 0 && <tr><td colSpan="4" className="prazno">Još nema plaćanja.</td></tr>}
          </tbody>
        </table>
      </div>
    </>
  );
}
