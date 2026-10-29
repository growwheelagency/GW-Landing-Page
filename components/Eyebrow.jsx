// Section label with a selection frame: thin border and square corner handles.
export default function Eyebrow({ children }) {
  return (
    <span className="lab fr">
      <i />
      {children}
    </span>
  );
}
