# Istruzioni per il task ChatGPT quotidiano

Testo da usare nel task programmato di ChatGPT (abbonamento, nessuna API) per scrivere il post del giorno.
Il publisher (`scripts/publish-posts.ts`, workflow `.github/workflows/publish-posts.yml`) fa il resto:
validazione, scrittura atomica su Supabase, build Vercel. Formato definito in `src/lib/content/post.ts`.

Campi concordati con l'utente il 2026-11-01: un briefing al giorno con uno o più risultati, stati scientifici
mantenuti, niente argomenti, niente periodo coperto (il publisher usa "ieri"), dichiarazione AI fissa.

Seconda versione (2026-11-01, dopo due corse singole senza risultati): temi e fonti ripresi dal task originale
"Briefing quotidiano ricerca TCS", finestra "dall'ultimo post", data di annuncio arXiv, 1-3 risultati per post
(l'utente preferisce quasi un post al giorno), niente ripetizioni dei post precedenti. Il task originale in
italiano viene sostituito da questo, su decisione dell'utente.

## Testo del task (da incollare in inglese)

```text
Every day, prepare today's Briefly.tcs post: an English research briefing for graduate students and researchers
on new results in mathematics and theoretical computer science since the last published post (the newest file in
`posts/` on branch `posts` of Mik1810/Briefly-tcs; if there is none, the last 3 days).

Follow graph algorithms and combinatorics, approximation and inapproximability, computational complexity and
hardness, parameterized complexity, randomized algorithms, open problems in mathematics, and new results
obtained with AI.

Check at least: the latest announcement blocks of arXiv cs.DS, cs.CC, cs.DM and math.CO
(https://arxiv.org/list/<category>/recent), the ECCC report index (https://eccc.weizmann.ac.il/reports/),
Erdős Problems, OpenAI math on GitHub, TheoretiCS, Theory of Computing and other TCS journals. Use the arXiv
announcement date, not the submission date, to decide what is new. Skip anything already covered in previous
files in `posts/`.

Select the 1 to 3 most important new results: prefer breakthroughs and significant theoretical advances over
routine papers, but publish the best available results even on quiet days. Create no file only if the sources
show nothing new at all since the last post.

For each result give, in the body: the precise statement, what is new relative to the state of the art, the
proof technique if available, and the verification status. Distinguish unverified claims, preprints, formally
verified results and peer-reviewed work, without confusing them.

Publish it by creating ONE new file in the GitHub repository Mik1810/Briefly-tcs, branch `posts`
(never `main`), at `posts/YYYY-MM-DD.json`, where YYYY-MM-DD is today's date in Europe/Rome.
Never modify or delete existing files. If the file for today already exists, do nothing.

The file must be valid JSON with exactly these fields (no others):

{
  "format": "briefly-post/1",
  "date": "YYYY-MM-DD",
  "title": "plain text, no $ and no Markdown",
  "summary": "one or two plain-text sentences, no $",
  "intro": "optional Markdown paragraph; omit the field if not needed",
  "results": [
    {
      "title": "plain text, no $",
      "summary": "one plain-text sentence, no $",
      "publication": "preprint" | "accepted" | "published" | "classic-result",
      "formalization": "not-stated" | "formalized",
      "body": "Markdown; math as $...$ inline and $$...$$ display (LaTeX, escape backslashes in JSON)",
      "sources": [
        {
          "title": "exact title of the source",
          "authors": ["Full Name", "..."],
          "year": 2026,
          "venue": "e.g. arXiv:2611.01234 [cs.CC], or the journal/conference",
          "url": "https://... (https only)",
          "kind": "preprint" | "article" | "book" | "web-page",
          "lang": "en"
        }
      ]
    }
  ]
}

Rules:
- At least one result; every result has at least one source, preferably the primary source (arXiv, ECCC,
  proceedings, authors' pages). Cite the version you actually read.
- Only state what the sources support. Say clearly whether a result is a preprint, accepted or published.
  Do not claim that a proof has been checked: the site labels every post "automated check only".
- `formalization` is "formalized" only if the source says the proof is formalized in a proof assistant.
- `year`, `venue`, `lang` and `intro` are optional; omit them rather than guessing.
- Do not include topics, dates of coverage, review status or any other field.
```

## Note operative

- Prova completa riuscita il 2026-11-01 con un post di test (poi rimosso): vedi
  `sessions/2026-11-01_13-54-23_claude-publisher-pipeline.md`.
- Un post già pubblicato non viene sovrascritto: se il contenuto cambia il workflow fallisce in modo visibile.
  Correzioni e modifiche non sono ancora automatiche.
- Esiti: GitHub → Actions → "Publish posts". Il workflow non controlla l'esito della build Vercel.
- Non cambiare il task ChatGPT originale finché il nuovo testo non è stato provato con una corsa singola.
- Prima versione (finestra "previous day", nessuna fonte indicata, soglia "most significant"): due corse singole
  il 2026-11-01 senza alcun file, anche per il 29-31 ottobre, mentre il task originale aveva trovato risultati
  del 30 ottobre su arXiv ed ECCC.
