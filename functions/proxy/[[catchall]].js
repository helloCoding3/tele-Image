export function onRequest(context) {
  // JSON.stringify(context.params.catchall)
  const path = JSON.parse(JSON.stringify(context.params.catchall));
  // console.log('path :>> ', path);
  const url = "https://" + path.join('/');
  console.log('url :>> ', url);
  const response = fetch(url);
  // return new Response(url);
  return response;
}