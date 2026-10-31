interface Props {
  /** HTML prodotto in build da renderMarkdown a partire da contenuti validati (HTML grezzo escluso). */
  html: string;
  className?: string;
}

export default function HtmlBody({ html, className = 'prose' }: Props) {
  return <div className={className} dangerouslySetInnerHTML={{ __html: html }} />;
}
