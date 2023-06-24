export function onRequest(context) {
  // JSON.stringify(context.params.catchall)
  const url = "https://cdn-images-1.medium.com/" + context.params.catchall.jion('/');
  return new Response(url);
}