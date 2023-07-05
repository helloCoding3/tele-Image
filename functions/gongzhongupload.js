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
  console.log('request.headers :>> ', request.headers);
  // console.log('url :>> ', url);

  var myHeaders = new Headers();
  myHeaders.append("Referer", "https://mp.weixin.qq.com/cgi-bin/appmsg?");
  myHeaders.append("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/115.0");

  myHeaders.append("content-length", request.headers.get('content-length'));
  myHeaders.append("content-type", request.headers.get('content-type'));
  myHeaders.append("Cookie", request.headers.get('cookie'));

  const token = request.headers.get('token');
  const t = request.headers.get('t');
  const requrl = `https://mp.weixin.qq.com/cgi-bin/uploadimg2cdn?lang=zh_CN&token=${token}&t=${t}`;
  const response = fetch(requrl, {
    method: 'POST',
    headers: myHeaders,
    body: request.body,
    redirect: 'follow'
  })
  return response;
  // return new Response("ok")
}
