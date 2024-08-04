const getPlaysuferfn = async () => {
  const myHeaders = new Headers();
  myHeaders.append("Cookie", "PHPSESSID=453062b1d4832d255237ee15c6a59d0d; _pk_id.1.4f37=4e436f48226fe46b.1722755348.; _pk_ses.1.4f37=1; yitonguser=74f12c4ef6f6b8d51fceb94c95fdad7d; id=159081691; _vid_t=HPWsgGmj6MK9n/YkclhwO8A0xE6Q6Sf3zq2hneXu96FkAvPOco3pQN64/dDtDbY8wF9vGwicRw8x69FNLl6zlhMwim0frHu7VeZGhQ==; visitorId=VaqL2Ucb8dpFxtYDWGBJ; userdomain=gvum8.fun; _gid=GA1.2.1739706878.1722755463; _gat_gtag_UA_139395839_1=1; _ga_XS4WW82D74=GS1.1.1722755462.1.1.1722756732.60.0.0; _ga=GA1.1.709762195.1722755463; PHPSESSID=453062b1d4832d255237ee15c6a59d0d");
  myHeaders.append("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:129.0) Gecko/20100101 Firefox/129.0");

  const requestOptions = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow"
  };

  const response = await fetch("https://gvum8.fun/mvplay-585.html", requestOptions);
  const html = await response.text();
  // 查找所有的script标签
  const pattern = /url(.*?)index\.m3u8/g;
  const matches = html.match(pattern);
  // console.log('matches :>> ', matches[0]);
  const match = matches[0];
  const playsuf = 'https://gvum8.fun/' + match.split(
    '/')[1] + '/' + match.split('/')[2];
  console.log('playsuf :>> ', playsuf);
  return playsuf;
}
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

  if (request.method == 'GET') {

    const response = await getPlaysuferfn();
    // const response = await fetch(requrl, {
    //   method: 'POST',
    //   headers: myHeaders,
    //   body: request.body,
    //   redirect: 'follow'
    // });
    // const newresult = await response.text();
    // console.log('newresult :>> ', newresult);
    // return newresult;
    // return new Response("ok")
    return new Response(response, {
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


