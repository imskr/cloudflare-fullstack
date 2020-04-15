addEventListener('fetch', (event) => {
  event.respondWith(handleRequest(event.request));
});

/**
 * Respond with hello worker text
 * @param {Request} request
 */

async function handleRequest(request) {
  const apiVariant = await fetch(
    'https://cfw-takehome.developers.workers.dev/api/variants'
  );

  // handle error in better way
  if (!apiVariant.ok) {
    return new Response('Error in fetch call', {
      headers: { 'content-type': 'text/plain' },
    });
  }

  const URLs = await apiVariant.json();
  const urlToFetch = evenSelect(URLs.variants);
  const fetchPage = await fetch(urlToFetch);

  // handle error in a better way
  if (!fetchPage.ok) {
    return new Response('Error in fetching page html', {
      headers: { 'content-type': 'text/plain' },
    });
  }

  const pageTohtml = await fetchPage.text();
  return new Response(pageTohtml, {
    headers: { 'content-type': 'text/html' },
  });
}

/**
 * Evenly array
 * @param {Array} urlArr
 */

function evenSelect(urlArr) {
  const random = Math.round(Math.random());
  return urlArr[random];
}
