// Oznaka + input/select + poruka o grešci. `children` je sam input (ili select).
export default function Polje({ oznaka, greska, children }) {
  return (
    <label className="polje">
      {oznaka}
      {children}
      {greska && <em role="alert">{greska}</em>}
    </label>
  );
}
