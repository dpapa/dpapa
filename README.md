# NoWire Osijek

Web aplikacija za evidenciju korisnika i pretplata bežične mreže NoWire Osijek: tko je priključen,
koju pretplatu ima, je li plaćena i kada ističe. Izrađena u Reactu 18 i Viteu, bez backenda –
podaci se spremaju u `localStorage` preglednika. Sučelje je u izgledu terminala.

## Pokretanje

Potreban je Node.js 18 ili noviji.

```bash
npm install
npm run dev      # razvojni poslužitelj (http://localhost:5173)
npm run build    # produkcijski build u mapi dist/
npm run preview  # pregled produkcijskog builda
```

## Funkcionalnosti

- **Nadzorna ploča:** broj korisnika (aktivnih i neaktivnih), aktivnih i neplaćenih pretplata, iznos naplaćen ovaj mjesec, prečaci te popisi pretplata koje istječu u 7 dana, neplaćenih pretplata i posljednjih plaćanja.
- **Korisnici:** popis s pretragom po imenu i adresi te filterom po statusu; dodavanje, uređivanje i brisanje. Korisnik s pretplatama ne može se obrisati.
- **Detalji korisnika:** podaci o korisniku i opremi, ukupno plaćeno i neplaćeno te povijest pretplata.
- **Pretplate:** filteri (sve, neplaćene, istječu u 7 dana, aktivne), dodavanje, uređivanje, brisanje i brza evidencija plaćanja.
- Validacija formi: obavezna polja, ispravan e-mail, IP adresa i MAC adresa, završetak nakon početka, cijena veća od 0 te datum i iznos plaćanja.

## Struktura projekta

```
src/
├── data/         konstante, demo podaci (seed.js) i reducer
├── hooks/        useStore (stanje + localStorage), useHashRoute (routing preko #)
├── utils/        format.js (datumi, iznosi), stats.js (brojke, filteri), validation.js
├── components/   Zaglavlje, Polje, KorisnikForma, PretplataForma
├── pages/        Nadzorna, Korisnici, Korisnik, Pretplate
├── App.jsx       sastavlja aplikaciju: zaglavlje, stranica prema adresi, podnožje
└── styles.css    stilovi (boje su CSS varijable na vrhu)
```

## Adrese (routing)

| Adresa                   | Stranica                                        |
| ------------------------ | ----------------------------------------------- |
| `#/`                     | Nadzorna ploča                                  |
| `#/korisnici`            | Popis korisnika                                 |
| `#/korisnici/novi`       | Popis s otvorenim obrascem za novog korisnika   |
| `#/korisnik/ŠIFRA`       | Detalji korisnika                               |
| `#/pretplate`            | Popis pretplata                                 |
| `#/pretplate/nova`       | Popis s otvorenim obrascem za novu pretplatu    |
| `#/pretplate/neplacene`  | Samo neplaćene (također `istjecu`, `aktivne`)   |

## Podaci

Spremaju se u `localStorage` pod ključevima `nw_korisnici` i `nw_pretplate`.

- **korisnik:** `sifra`, `ime`, `prezime`, `adresa`, `mjesto`, `telefon`, `email`, `korisnickoIme`, `ipAdresa`, `macAdresa`, `modelOpreme`, `datumPrikljucenja`, `status`, `napomena`
- **pretplata:** `sifra`, `korisnik` (šifra korisnika), `paket`, `brzina`, `datumPocetka`, `datumZavrsetka`, `trajanje` (mjeseci), `cijena`, `placeno`, `datumPlacanja`, `placeniIznos`, `nacinPlacanja`

Odnos je 1 : N – jedan korisnik može imati više pretplata. Datumi demo pretplata računaju se od
današnjeg dana. Za povratak na demo podatke obriši oba ključa u alatima preglednika (Application → Local Storage).
