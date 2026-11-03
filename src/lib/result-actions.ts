// Unico JavaScript del sito: azioni sotto ogni risultato. Facoltativo: senza JavaScript la lettura è identica.
// - Copia link: l'icona è un normale link all'ancora; con JavaScript copia l'indirizzo negli appunti.
// - Condividi: pulsante nascosto, mostrato solo se il browser offre il menu di condivisione (navigator.share).
// Inserito inline solo nelle pagine articolo; scripts/check-dist.ts accetta solo questo script, carattere per carattere.

export const RESULT_ACTIONS_SCRIPT = `if (navigator.share) {
  for (const button of document.querySelectorAll('button[data-share]')) button.hidden = false;
}
document.addEventListener('click', async (event) => {
  const target = event.target instanceof Element ? event.target : null;
  const share = target ? target.closest('button[data-share]') : null;
  if (share) {
    try {
      await navigator.share({ title: share.dataset.title, url: new URL(share.dataset.href, location.href).href });
    } catch {}
    return;
  }
  const link = target ? target.closest('a[data-copy-link]') : null;
  if (!link || !navigator.clipboard) return;
  event.preventDefault();
  try {
    await navigator.clipboard.writeText(new URL(link.getAttribute('href'), location.href).href);
    const status = link.parentElement.querySelector('.copy-status');
    link.dataset.state = 'copied';
    status.textContent = 'Link copied';
    setTimeout(() => {
      delete link.dataset.state;
      status.textContent = '';
    }, 2000);
  } catch {
    location.hash = link.getAttribute('href');
  }
});`;
