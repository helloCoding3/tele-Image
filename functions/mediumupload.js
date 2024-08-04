export async function onRequest(context) {  // Contents of context object  
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
  console.log('request :>> ', request.method);
  // console.log('url :>> ', url);

  if (request.method == 'POST') {
    var myHeaders = new Headers();
    myHeaders.append("Origin", "https://medium.com");
    myHeaders.append("Referer", "https://medium.com/p/cf2bf34d2333/edit");
    myHeaders.append("mimeType", "multipart/form-data");
    myHeaders.append("User-Agent", " Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/115.0");
    myHeaders.append("Authorization", "Bearer 25f03882340ad55da87ab7526358453ffc677467ba897dafd8ad6f78f906179f8");
    myHeaders.append("content-length", request.headers.get('content-length'));
    myHeaders.append("content-type", request.headers.get('content-type'));


    const response = fetch("https://api.medium.com/v1/images", {
      method: 'POST',
      headers: myHeaders,
      body: request.body,
      redirect: 'follow'
    })
    return response;
  }
  else {
    return new Response(null, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': '*',
        'Access-Control-Allow-Methods': '*',
        'Access-Control-Max-Age': '86400',
      },
    })
  }

}
