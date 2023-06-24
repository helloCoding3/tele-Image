export function onRequest(context) {
  // JSON.stringify(context.params.catchall)
  const path = JSON.parse(JSON.stringify(context.params.catchall));
  // const url = "https://cdn-images-1.medium.com/" + path.jion('/');
  return new Response(JSON.stringify(context.params.catchall));
}