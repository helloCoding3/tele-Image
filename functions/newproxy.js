export async function onRequestGet(context) {  // Contents of context object  
  const {
    request, // same as existing Worker API    
    env, // same as existing Worker API    
    params, // if filename includes [id] or [[path]]   
    waitUntil, // same as ctx.waitUntil in existing Worker API    
    next, // used for middleware or to fetch assets    
    data, // arbitrary space for passing data between middlewares 
  } = context;
  context.request
  const url = new URL(request.url);
  console.log('url :>> ', url);
  const myparam = url.searchParams;
  const proxyurl = myparam.get('url');
  console.log('proxyurl :>> ', proxyurl);
  const response = fetch(proxyurl, {
    method: request.method,
    headers: request.headers,
  });
  return response;
  // const response = fetch('https://telegra.ph/' + url.pathname + url.search, {
  //   method: request.method,
  //   headers: request.headers,
  //   body: request.body,
  // });
  // return response;
  // return new Response("ok");
}
