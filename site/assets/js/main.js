const main = () => {
  let quotes = [];

  const error = (e) => {
    console.error(e);
  }

  const slug = (s) => {
    return s.replace(/[. ]+/g, '-')
      .replace(/ö/, 'o')
      .replace(/ü/, 'u')
      .replace(/[^a-zA-Z0-9-]/g, "").toLowerCase();
  }

  const render = (quote) => {
    const qu = document.querySelector('section.quote > div:first-child');
    const el = qu.cloneNode(true);
    const bl = el.querySelector('blockquote');
    const au = el.querySelector('cite a');
    const href = `/authors/${slug(quote.author)}/`;
    au.setAttribute('href', href);
    bl.innerText = quote.quote;
    au.innerText  = quote.author;
    el.classList.remove('hidden');
    el.style.opacity = "0"
    qu.parentNode.replaceChild(el, qu);
    setTimeout(() => { el.style.opacity = "1" }, 50);
  }

  const pick = (list) => {
    if (list && list.length) {
      let id = list[Math.floor(Math.random() * list.length)];
      fetch(`/quotes/${id}.json`)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Fetch error, status = " + response.status);
          }
          return response.json();
        })
        .then(render)
        .catch(error);
    }
    quotes = list;
  }

  const el = document.querySelector('[href="#next"]');
  el.classList.remove('hidden');
  el.addEventListener('click', (e) => {
    e.preventDefault();
    pick(quotes)
  });

  fetch('/quotes/index.json')
    .then(function(response) {
      if (!response.ok) {
        throw new Error("Fetch error, status = " + response.status);
      }
      return response.json();
    })
    .then(pick)
    .catch(error);
}

main();
