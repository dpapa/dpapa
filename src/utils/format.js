// Pomoćne funkcije za datume i prikaz iznosa.

const dvoznamenkasto = (n) => String(n).padStart(2, '0');

const uIso = (d) => `${d.getFullYear()}-${dvoznamenkasto(d.getMonth() + 1)}-${dvoznamenkasto(d.getDate())}`;

// Današnji datum kao ISO (GGGG-MM-DD) po lokalnom vremenu
export const danas = () => uIso(new Date());

// ISO datum pomaknut za `dana` dana
export function dodajDane(iso, dana) {
  const d = new Date(`${iso}T12:00:00`);
  d.setDate(d.getDate() + dana);
  return uIso(d);
}

// ISO datum pomaknut za `mjeseci` mjeseci (zadnji dan mjeseca se čuva, npr. 31.1. + 1 mj = 28.2.)
export function dodajMjesece(iso, mjeseci) {
  const d = new Date(`${iso}T12:00:00`);
  const dan = d.getDate();
  d.setDate(1);
  d.setMonth(d.getMonth() + mjeseci);
  const zadnji = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
  d.setDate(Math.min(dan, zadnji));
  return uIso(d);
}

// "2026-11-11" -> "11. 11. 2026." (DD. MM. GGGG.)
export function formatirajDatum(iso) {
  if (!iso) return '–';
  const [g, m, d] = iso.split('-');
  return `${d}. ${m}. ${g}.`;
}

export const formatirajRazdoblje = (p) => `${formatirajDatum(p.datumPocetka)} – ${formatirajDatum(p.datumZavrsetka)}`;

// 20 -> "20,00 €"
export const formatirajIznos = (iznos) =>
  `${Number(iznos || 0).toLocaleString('hr-HR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €`;

export const punoIme = (k) => (k ? `${k.ime} ${k.prezime}` : '–');
