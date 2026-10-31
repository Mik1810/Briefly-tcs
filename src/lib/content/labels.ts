import type {
  CorrectionKind,
  FormalizationStatus,
  PublicationStatus,
  SourceKind,
  VerificationStatus,
} from './types.ts';

// Etichette testuali sobrie, senza colori per categoria.

export const PUBLICATION_LABELS: Record<PublicationStatus, string> = {
  'risultato-classico': 'risultato classico da manuale',
  preprint: 'preprint, non sottoposto a revisione',
  accettato: 'accettato per la pubblicazione',
  pubblicato: 'pubblicato',
};

export const FORMALIZATION_LABELS: Record<FormalizationStatus, string> = {
  'non-indicata': 'formalizzazione non indicata',
  formalizzato: 'formalizzato in un assistente di prova',
};

export const VERIFICATION_LABELS: Record<VerificationStatus, string> = {
  'non-verificato': 'nessuna verifica redazionale registrata',
  'controllo-automatico': 'solo controllo automatico',
  'revisione-redazionale': 'rivisto dalla redazione',
  'revisione-indipendente': 'verificato in modo indipendente',
};

export const SOURCE_KIND_LABELS: Record<SourceKind, string> = {
  libro: 'Libro',
  articolo: 'Articolo',
  preprint: 'Preprint',
  'pagina-web': 'Pagina web',
};

export const CORRECTION_KIND_LABELS: Record<CorrectionKind, string> = {
  sostanziale: 'Correzione sostanziale',
  minore: 'Correzione minore',
};
