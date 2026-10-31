interface Props {
  demo: boolean;
}

/** Etichetta obbligatoria su ogni contenuto scritto solo per il prototipo. */
export default function DemoLabel({ demo }: Props) {
  return demo ? <p className="eyebrow">Contenuto dimostrativo</p> : null;
}
