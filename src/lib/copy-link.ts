// Unico JavaScript del sito: copia negli appunti il link di un risultato. Facoltativo: senza JavaScript, o se
// la copia non riesce, l'icona resta un normale link all'ancora. Inserito inline solo nelle pagine articolo;
// scripts/check-dist.ts accetta solo questo script, carattere per carattere.

export const COPY_LINK_SCRIPT = `document.addEventListener('click', async (event) => {
  const link = event.target instanceof Element ? event.target.closest('a[data-copy-link]') : null;
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
