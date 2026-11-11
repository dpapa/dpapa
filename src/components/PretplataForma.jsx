import { useState } from 'react';
import Polje from './Polje.jsx';
import { NACINI_PLACANJA } from '../data/constants.js';
import { danas, dodajMjesece, punoIme } from '../utils/format.js';
import { validirajPretplatu } from '../utils/validation.js';

const prazna = () => ({
  korisnik: '', paket: 'Internet 50 Mbps', brzina: '50 Mbps', datumPocetka: danas(), datumZavrsetka: dodajMjesece(danas(), 1),
  trajanje: 1, cijena: 20, placeno: false, datumPlacanja: '', placeniIznos: '', nacinPlacanja: '',
});

// Obrazac za novu ili uređivanu pretplatu; polja plaćanja vrijede kad je kvačica "Plaćeno" uključena.
export default function PretplataForma({ pretplata, korisnici, onSpremi, onOdustani }) {
  const [v, setV] = useState(pretplata ?? prazna());
  const [pokaziGreske, setPokaziGreske] = useState(false);
  const greske = validirajPretplatu(v);

  const promijeni = (e) => {
    const { name, value, type, checked } = e.target;
    setV((prethodno) => ({ ...prethodno, [name]: type === 'checkbox' ? checked : value }));
  };
  const g = (polje) => (pokaziGreske ? greske[polje] : undefined);

  const posalji = (e) => {
    e.preventDefault();
    setPokaziGreske(true);
    if (Object.keys(greske).length > 0) return;
    onSpremi({
      ...v,
      korisnik: Number(v.korisnik),
      trajanje: Number(v.trajanje),
      cijena: Number(v.cijena),
      placeniIznos: v.placeno ? Number(v.placeniIznos) : '',
      datumPlacanja: v.placeno ? v.datumPlacanja : '',
      nacinPlacanja: v.placeno ? v.nacinPlacanja : '',
    });
  };

  const polje = (naziv, oznaka, tip = 'text', dodatno = {}) => (
    <Polje oznaka={oznaka} greska={g(naziv)}>
      <input type={tip} name={naziv} value={v[naziv]} onChange={promijeni} {...dodatno} />
    </Polje>
  );

  return (
    <form className="forma kutija" onSubmit={posalji} noValidate>
      <h2>{pretplata ? 'Uredi zapis' : 'Nova pretplata'}</h2>
      <div className="forma__mreza">
        <Polje oznaka="Korisnik" greska={g('korisnik')}>
          <select name="korisnik" value={v.korisnik} onChange={promijeni}>
            <option value="">— odaberite —</option>
            {korisnici.map((k) => <option key={k.sifra} value={k.sifra}>{punoIme(k)}</option>)}
          </select>
        </Polje>
        {polje('paket', 'Naziv paketa')}
        {polje('brzina', 'Brzina interneta')}
        {polje('datumPocetka', 'Datum početka', 'date')}
        {polje('datumZavrsetka', 'Datum završetka', 'date')}
        {polje('trajanje', 'Trajanje (mjeseci)', 'number', { min: 1 })}
        {polje('cijena', 'Cijena (€)', 'number', { step: '0.01' })}
        <label className="check">
          <input type="checkbox" name="placeno" checked={v.placeno} onChange={promijeni} />
          Plaćeno
        </label>
        {polje('datumPlacanja', 'Datum plaćanja', 'date')}
        {polje('placeniIznos', 'Plaćeni iznos (€)', 'number', { step: '0.01' })}
        <Polje oznaka="Način plaćanja">
          <select name="nacinPlacanja" value={v.nacinPlacanja} onChange={promijeni}>
            <option value="">— odaberite —</option>
            {NACINI_PLACANJA.map((n) => <option key={n}>{n}</option>)}
          </select>
        </Polje>
      </div>
      <div className="forma__gumbi">
        <button type="submit" className="gumb gumb--glavni">Spremi</button>
        <button type="button" className="gumb" onClick={onOdustani}>Odustani</button>
      </div>
    </form>
  );
}
