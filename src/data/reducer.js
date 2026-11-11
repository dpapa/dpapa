// Reducer za kolekcije `korisnici` i `pretplate`.
// Čista funkcija (bez side-effecta): prima stanje i akciju, vraća novo stanje.
// Svaka stavka ima numeričku šifru (`sifra`); nova dobiva najveću postojeću + 1.

const sljedecaSifra = (popis) => popis.reduce((najveca, s) => Math.max(najveca, s.sifra), 0) + 1;

export function reducer(stanje, akcija) {
  switch (akcija.tip) {
    case 'SPREMI': {
      const { kolekcija, stavka } = akcija;
      const popis = stanje[kolekcija];
      const postoji = stavka.sifra !== undefined && popis.some((s) => s.sifra === stavka.sifra);
      return {
        ...stanje,
        [kolekcija]: postoji
          ? popis.map((s) => (s.sifra === stavka.sifra ? stavka : s))
          : [...popis, { ...stavka, sifra: sljedecaSifra(popis) }],
      };
    }

    case 'OBRISI':
      return { ...stanje, [akcija.kolekcija]: stanje[akcija.kolekcija].filter((s) => s.sifra !== akcija.sifra) };

    default:
      return stanje;
  }
}
