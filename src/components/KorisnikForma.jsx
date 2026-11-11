import { useState } from 'react';
import Polje from './Polje.jsx';
import { STATUSI_KORISNIKA } from '../data/constants.js';
import { danas } from '../utils/format.js';
import { validirajKorisnika } from '../utils/validation.js';

const prazan = () => ({
  ime: '', prezime: '', adresa: '', mjesto: 'Osijek', telefon: '', email: '', korisnickoIme: '',
  ipAdresa: '', macAdresa: '', modelOpreme: '', datumPrikljucenja: danas(), status: 'Aktivan', napomena: '',
});

// Obrazac za novog ili uređivanog korisnika.
export default function KorisnikForma({ korisnik, onSpremi, onOdustani }) {
  const [v, setV] = useState(korisnik ?? prazan());
  const [pokaziGreske, setPokaziGreske] = useState(false);
  const greske = validirajKorisnika(v);

  const promijeni = (e) => setV((prethodno) => ({ ...prethodno, [e.target.name]: e.target.value }));
  const g = (polje) => (pokaziGreske ? greske[polje] : undefined);

  const posalji = (e) => {
    e.preventDefault();
    setPokaziGreske(true);
    if (Object.keys(greske).length === 0) onSpremi(v);
  };

  const tekst = (naziv, oznaka, tip = 'text') => (
    <Polje oznaka={oznaka} greska={g(naziv)}>
      <input type={tip} name={naziv} value={v[naziv]} onChange={promijeni} />
    </Polje>
  );

  return (
    <form className="forma kutija" onSubmit={posalji} noValidate>
      <h2>{korisnik ? 'Uredi zapis' : 'Novi korisnik'}</h2>
      <div className="forma__mreza">
        {tekst('ime', 'Ime')}
        {tekst('prezime', 'Prezime')}
        {tekst('adresa', 'Adresa')}
        {tekst('mjesto', 'Mjesto')}
        {tekst('telefon', 'Telefon')}
        {tekst('email', 'E-mail', 'email')}
        {tekst('korisnickoIme', 'Korisničko ime')}
        {tekst('ipAdresa', 'IP adresa')}
        {tekst('macAdresa', 'MAC adresa uređaja')}
        {tekst('modelOpreme', 'Model opreme')}
        {tekst('datumPrikljucenja', 'Datum priključenja', 'date')}
        <Polje oznaka="Status korisnika">
          <select name="status" value={v.status} onChange={promijeni}>
            <option value="">— odaberite —</option>
            {STATUSI_KORISNIKA.map((s) => <option key={s}>{s}</option>)}
          </select>
        </Polje>
      </div>
      <Polje oznaka="Napomena">
        <textarea name="napomena" rows="3" value={v.napomena} onChange={promijeni} />
      </Polje>
      <div className="forma__gumbi">
        <button type="submit" className="gumb gumb--glavni">Spremi</button>
        <button type="button" className="gumb" onClick={onOdustani}>Odustani</button>
      </div>
    </form>
  );
}
