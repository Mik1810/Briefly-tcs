export type Section = 'articoli' | 'archivio' | 'metodo';

interface Props {
  current: Section | null;
  /** Vero se la pagina è la voce di navigazione stessa, falso se è una sua sottopagina. */
  currentIsPage: boolean;
}

const NAV_ITEMS: { key: Section; href: string; label: string }[] = [
  { key: 'articoli', href: '/', label: 'Articles' },
  { key: 'archivio', href: '/archive/', label: 'Archive' },
  { key: 'metodo', href: '/method/', label: 'Method' },
];

const MASTHEAD_NAME = (
  <>
    Briefly<span className="masthead-accent">.tcs</span>
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
        <p className="masthead-tagline">Theoretical computer science briefings for graduate students and researchers.</p>
      </div>
      <nav className="site-nav" aria-label="Sections">
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
