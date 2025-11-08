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
  // console.log('url :>> ', url);
  const myparam = url.searchParams;
  console.log('myparam :>> ', myparam);
  console.log(myparam.get("url")); 
  const proxyurl = request.url.split("proxyany?url=")[1];

  if (request.method == 'POST') {
    // console.log('request.body :>> ', request.body);
    let body = "";
    try {
      body = await request.json();
    } catch (error) {
      console.log('error :>> ', error);
    }
    // If someone is trying to get the images from FormData then use this...
    // const images = await req.formData();
    //the formData will be your formData name which you send it from frontend
    // console.log('body :>> ', body);

    const requestOptions = {
      method: "POST",
      headers: request.headers,
      redirect: "follow"
    };
    if (body !== "") {
      const raw = JSON.stringify(body);
      requestOptions.body = raw;
    }
    const response = await fetch(proxyurl, requestOptions)
    const text = await response.text();
    console.log('text :>> ', text);

    // return new Response("ok")
    return new Response(text, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': '*',
        'Access-Control-Allow-Methods': '*',
        'Access-Control-Max-Age': '86400',
      },
    })


  }
  else if (request.method == 'GET') {
    console.log('proxyurl :>> ', proxyurl);
    const response = fetch(proxyurl, {
      method: request.method,
      headers: request.headers,
      redirect: "follow"
    });
    return response;
    // return new Response(proxyurl)
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
