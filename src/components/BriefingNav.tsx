import { briefingPath } from '../lib/content/repository.ts';
import type { Briefing } from '../lib/content/types.ts';
import DateText from './DateText.tsx';

interface Props {
  newer?: Briefing;
  older?: Briefing;
}

export default function BriefingNav({ newer, older }: Props) {
  if (!newer && !older) return null;
  return (
    <nav className="briefing-nav" aria-label="Briefing precedente e successivo">
      {older ? (
        <a href={briefingPath(older)} rel="prev">
          <span className="briefing-nav-label">Precedente</span>
          <span className="briefing-nav-title">{older.title}</span>
          <DateText date={older.date} />
        </a>
      ) : (
        <span />
      )}
      {newer ? (
        <a href={briefingPath(newer)} rel="next" className="briefing-nav-next">
          <span className="briefing-nav-label">Successivo</span>
          <span className="briefing-nav-title">{newer.title}</span>
          <DateText date={newer.date} />
        </a>
      ) : null}
    </nav>
  );
}
