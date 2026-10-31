interface Props {
  demo: boolean;
}

/** Etichetta obbligatoria su ogni contenuto scritto solo per il prototipo. */
export default function DemoLabel({ demo }: Props) {
  return demo ? <p className="eyebrow">Demo content</p> : null;
}
