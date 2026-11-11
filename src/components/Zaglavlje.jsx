import { AUTOR, NAZIV } from '../data/constants.js';
import { idi } from '../hooks/useHashRoute.js';

const STAVKE = [
  { naziv: 'Nadzorna ploča', putanja: '/', korijeni: ['', 'nadzorna'] },
  { naziv: 'Korisnici', putanja: '/korisnici', korijeni: ['korisnici', 'korisnik'] },
  { naziv: 'Pretplate', putanja: '/pretplate', korijeni: ['pretplate'] },
];

// Zaglavlje u stilu terminala: "root@ NoWire Osijek :~$" i izbornik u uglatim zagradama.
export default function Zaglavlje({ dijelovi }) {
  const aktivno = dijelovi[0] ?? '';
  return (
    <header className="zaglavlje">
      <button className="prompt" onClick={() => idi('/')}>
        root@ <strong>{NAZIV}</strong> <small>{AUTOR}</small> :~$
      </button>
      <nav aria-label="Glavna navigacija">
        {STAVKE.map((s) => {
          const jeAktivna = s.korijeni.includes(aktivno);
          return (
            <button
              key={s.putanja}
              className={jeAktivna ? 'aktivno' : ''}
              aria-current={jeAktivna ? 'page' : undefined}
              onClick={() => idi(s.putanja)}
            >
              [{s.naziv}]
            </button>
          );
        })}
      </nav>
    </header>
  );
}
