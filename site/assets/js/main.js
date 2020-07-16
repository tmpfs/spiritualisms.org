const main = () => {
  let all = [];
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
      const index = Math.floor(Math.random() * list.length);
      const id = list[index];
      list.splice(index, 1);
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
    if (quotes && quotes.length === 0 && all && all.length > 0) {
      quotes = all.slice(0);
    }
    pick(quotes)
  });

  fetch('/quotes/index.json')
    .then(function(response) {
      if (!response.ok) {
        throw new Error("Fetch error, status = " + response.status);
      }
      return response.json();
    })
    .then((list) => {
      all = list.slice(0);
      pick(list);
    })
    .catch(error);
}

main();
