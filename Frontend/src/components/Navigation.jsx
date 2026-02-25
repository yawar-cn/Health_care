export default function Navigation({ items }) {
  return (
    <nav className="flex flex-wrap gap-3">
      {items.map((item) => (
        <a
          key={item.href}
          href={item.href}
          className="tag bg-white/70 text-slateblue shadow-sm transition hover:bg-ink hover:text-white"
        >
          {item.label}
        </a>
      ))}
    </nav>
  );
}
