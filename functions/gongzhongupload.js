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
  // console.log('request.headers :>> ', request.headers);
  // console.log('url :>> ', url);

  const cookieresponse = await fetch("https://dev.usemock.com/65a3f1966330cd8519c82fc1/gongzhonghao/key")
  const result = await cookieresponse.text();
  console.log('获取公众号token情况 :>> ', result);
  const jsonres = JSON.parse(result);

  if (request.method == 'POST') {
    var myHeaders = new Headers();
    myHeaders.append("Referer", "https://mp.weixin.qq.com/cgi-bin/appmsg?");
    myHeaders.append("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/115.0");

    myHeaders.append("content-length", request.headers.get('content-length'));
    myHeaders.append("content-type", request.headers.get('content-type'));
    myHeaders.append("Cookie", jsonres['Cookie']);

    const token = jsonres['token'];
    const t = request.headers.get('t');
    const requrl = `https://mp.weixin.qq.com/cgi-bin/uploadimg2cdn?lang=zh_CN&token=${token}&t=${t}`;
    const response = await fetch(requrl, {
      method: 'POST',
      headers: myHeaders,
      body: request.body,
      redirect: 'follow'
    });
    const newresult = await response.text();
    console.log('newresult :>> ', newresult);
    // return response;
    // return new Response("ok")
    return new Response(newresult, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': '*',
        'Access-Control-Allow-Methods': '*',
        'Access-Control-Max-Age': '86400',
      },
    })

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
