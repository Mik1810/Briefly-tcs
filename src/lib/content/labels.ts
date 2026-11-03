import type { FormalizationStatus, PublicationStatus, SourceKind, VerificationStatus } from './types.ts';

// Etichette pubbliche (inglese) dei valori del vocabolario. I valori interni restano invariati.
// Testo sobrio, senza colori per categoria.

export const PUBLICATION_LABELS: Record<PublicationStatus, string> = {
  'risultato-classico': 'classic textbook result',
  preprint: 'preprint, not peer reviewed',
  accettato: 'accepted for publication',
  pubblicato: 'published',
};

export const FORMALIZATION_LABELS: Record<FormalizationStatus, string> = {
  'non-indicata': 'formalization not stated',
  formalizzato: 'formalized in a proof assistant',
};

export const VERIFICATION_LABELS: Record<VerificationStatus, string> = {
  'non-verificato': 'no editorial check recorded',
  'controllo-automatico': 'automated check only',
  'revisione-redazionale': 'reviewed by the editors',
  'revisione-indipendente': 'independently verified',
};

export const SOURCE_KIND_LABELS: Record<SourceKind, string> = {
  libro: 'Book',
  articolo: 'Article',
  preprint: 'Preprint',
  'pagina-web': 'Web page',
};
