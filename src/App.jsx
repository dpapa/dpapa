import Zaglavlje from './components/Zaglavlje.jsx';
import Nadzorna from './pages/Nadzorna.jsx';
import Korisnici from './pages/Korisnici.jsx';
import Korisnik from './pages/Korisnik.jsx';
import Pretplate from './pages/Pretplate.jsx';
import { useHashRoute } from './hooks/useHashRoute.js';
import { useStore } from './hooks/useStore.js';
import { NAZIV } from './data/constants.js';

// Sastavlja aplikaciju: zaglavlje, stranica prema adresi (#/korisnici ...) i podnožje.
export default function App() {
  const dijelovi = useHashRoute();
  const { podaci, spremi, obrisi } = useStore();
  const zajednicko = { dijelovi, podaci, spremi, obrisi };

  let stranica;
  switch (dijelovi[0]) {
    case 'korisnici': stranica = <Korisnici {...zajednicko} />; break;
    case 'korisnik': stranica = <Korisnik sifra={dijelovi[1]} podaci={podaci} />; break;
    case 'pretplate': stranica = <Pretplate {...zajednicko} />; break;
    default: stranica = <Nadzorna podaci={podaci} />; // nepoznata adresa vodi na nadzornu ploču
  }

  return (
    <>
      <Zaglavlje dijelovi={dijelovi} />
      <main className="okvir">{stranica}</main>
      <footer className="podnozje">© {NAZIV}</footer>
    </>
  );
}
