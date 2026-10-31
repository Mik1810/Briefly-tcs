export type Section = 'articoli' | 'archivio' | 'argomenti' | 'metodo';

interface Props {
  current: Section | null;
  /** Vero se la pagina è la voce di navigazione stessa, falso se è una sua sottopagina. */
  currentIsPage: boolean;
}

const NAV_ITEMS: { key: Section; href: string; label: string }[] = [
  { key: 'articoli', href: '/', label: 'Articoli' },
  { key: 'archivio', href: '/archivio/', label: 'Archivio' },
  { key: 'argomenti', href: '/argomenti/', label: 'Argomenti' },
  { key: 'metodo', href: '/metodo/', label: 'Metodo' },
];

const MASTHEAD_NAME = (
  <>
    <span className="masthead-accent">TCS</span> quotidiano
  </>
);

export default function SiteHeader({ current, currentIsPage }: Props) {
  // Il nome è l'h1 solo nella home; altrove è un collegamento e l'h1 è il titolo della pagina.
  const isHome = current === 'articoli' && currentIsPage;
  return (
    <header className="site-header">
      <div className="masthead">
        {isHome ? (
          <h1 className="masthead-name">{MASTHEAD_NAME}</h1>
        ) : (
          <a className="masthead-name" href="/">
            {MASTHEAD_NAME}
          </a>
        )}
        <p className="masthead-tagline">Briefing di informatica teorica per studenti magistrali e ricercatori.</p>
      </div>
      <nav className="site-nav" aria-label="Sezioni">
        <ul>
          {NAV_ITEMS.map((item) => (
            <li key={item.key}>
              <a
                href={item.href}
                aria-current={item.key === current ? (currentIsPage ? 'page' : 'true') : undefined}
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
