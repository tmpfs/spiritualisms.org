const main = () => {
  let quotes = [];

  const error = (e) => {
    console.error(e);
  }

  const pick = () => {
    if (quotes.length) {
      let id = quotes[Math.floor(Math.random() * quotes.length)];
      console.log(id)
      fetch(`/quotes/${id}.json`)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Fetch error, status = " + response.status);
          }
          return response.json();
        })
        .then((quote) => {
          console.log(quote);
        })
        .catch(error);
    }
  }

  fetch('/quotes/index.json')
    .then(function(response) {
      if (!response.ok) {
        throw new Error("Fetch error, status = " + response.status);
      }
      return response.json();
    })
    .then((list) => {
      quotes = list;
      pick();
      const el = document.querySelector('[href="#refresh"]');
      el.addEventListener('click', () => {
        console.log('pick another quote');
      })
    })
    .catch(error);
}

main();
