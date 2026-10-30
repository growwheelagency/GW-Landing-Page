import { Person } from "./Icons";
export default function Avatar({ photo, name = "" }: { photo?: string | null; name?: string }) {
  return (
    <span className="av">
      {photo ? <img src={photo} alt={name} /> : <Person />}
    </span>
  );
}
