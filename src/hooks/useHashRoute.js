import { useEffect, useState } from 'react';

// Jednostavan routing preko # u adresi: "#/korisnik/2" -> ['korisnik', '2']
const procitaj = () => window.location.hash.replace(/^#\/?/, '').split('/').filter(Boolean);

export function useHashRoute() {
  const [dijelovi, setDijelovi] = useState(procitaj);

  useEffect(() => {
    const naPromjenu = () => setDijelovi(procitaj());
    window.addEventListener('hashchange', naPromjenu);
    return () => window.removeEventListener('hashchange', naPromjenu);
  }, []);

  return dijelovi;
}

export const idi = (putanja) => {
  window.location.hash = `#${putanja}`;
};
