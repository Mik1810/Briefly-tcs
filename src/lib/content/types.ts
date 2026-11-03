// Modello editoriale del blog. Indipendente dalla sorgente dei dati (fixture oggi, Supabase in futuro).

/** Data di calendario editoriale, sempre stringa `YYYY-MM-DD`, mai convertita in istante con fuso. */
export type IsoDate = string;

export const EDITORIAL_STATUSES = ['bozza', 'pubblicato'] as const;
export type EditorialStatus = (typeof EDITORIAL_STATUSES)[number];

// Lo stato scientifico di un risultato ha dimensioni indipendenti: un preprint può essere formalizzato.
export const PUBLICATION_STATUSES = ['risultato-classico', 'preprint', 'accettato', 'pubblicato'] as const;
export type PublicationStatus = (typeof PUBLICATION_STATUSES)[number];

export const FORMALIZATION_STATUSES = ['non-indicata', 'formalizzato'] as const;
export type FormalizationStatus = (typeof FORMALIZATION_STATUSES)[number];

export const VERIFICATION_STATUSES = [
  'non-verificato',
  'controllo-automatico',
  'revisione-redazionale',
  'revisione-indipendente',
] as const;
export type VerificationStatus = (typeof VERIFICATION_STATUSES)[number];

export const SOURCE_KINDS = ['libro', 'articolo', 'preprint', 'pagina-web'] as const;
export type SourceKind = (typeof SOURCE_KINDS)[number];

export const CORRECTION_KINDS = ['sostanziale', 'minore'] as const;
export type CorrectionKind = (typeof CORRECTION_KINDS)[number];

export interface Source {
  title: string;
  authors: string[];
  year?: number;
  venue?: string;
  url?: string;
  kind: SourceKind;
  /** Lingua del titolo originale, per marcare `lang` quando diversa dall'italiano. */
  lang?: string;
}

export interface ScientificStatus {
  publication: PublicationStatus;
  formalization: FormalizationStatus;
  verification: VerificationStatus;
}

export interface Result {
  /** Slug stabile e unico in tutto il sito; diventa l'ancora `#result-<id>`. */
  id: string;
  title: string;
  /** Testo semplice: compare in liste e metadati, dove le formule non sono renderizzate. */
  summary: string;
  status: ScientificStatus;
  /** Markdown con formule `$…$` e `$$…$$`, renderizzato in build. */
  body: string;
  sources: Source[];
  /** Uso dell'AI dichiarato dagli autori del lavoro (non dal sito); assente nei contenuti precedenti. */
  aiUse?: string;
}

export interface Correction {
  date: IsoDate;
  kind: CorrectionKind;
  text: string;
  /** Risultato a cui si riferisce la correzione, se specifico. */
  resultId?: string;
}

export interface Briefing {
  /** Un briefing al giorno: la data è anche l'identificativo e lo slug dell'URL. */
  date: IsoDate;
  status: EditorialStatus;
  /** Contenuto scritto solo per il prototipo: viene etichettato come dimostrativo. */
  demo: boolean;
  title: string;
  summary: string;
  coverage: { from: IsoDate; to: IsoDate };
  updatedOn?: IsoDate;
  /** Markdown facoltativo prima dei risultati. */
  intro?: string;
  results: Result[];
  corrections: Correction[];
  /** Dichiarazione del ruolo dell'AI e della revisione effettivamente svolta. */
  aiDisclosure: string;
}

export interface RawContent {
  briefings: Briefing[];
}
