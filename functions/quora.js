export async function onRequest(context) {
  // Contents of context object
  const {
    request, // same as existing Worker API
    env, // same as existing Worker API
    params, // if filename includes [id] or [[path]]
    waitUntil, // same as ctx.waitUntil in existing Worker API
    next, // used for middleware or to fetch assets
    data, // arbitrary space for passing data between middlewares
  } = context;

  const url = new URL(request.url);
  console.log("request :>> ", request.method);

  if (request.method === "POST") {
    const myHeaders = new Headers();

    myHeaders.append("Host", "upload.quora.com");
    myHeaders.append("User-Agent", " Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:132.0) Gecko/20100101 Firefox/132.0");
    myHeaders.append("Accept", " */*");
    myHeaders.append("Accept-Language", "en-US,en;q=0.9,fr-FR;q=0.8,de-DE;q=0.7,es-ES;q=0.6,zh-CN;q=0.5,zh;q=0.4");
    myHeaders.append("Accept-Encoding", "gzip, deflate, br, zstd");
    myHeaders.append("Referer", "https://www.quora.com/");
    myHeaders.append("Origin", "https://www.quora.com");
    myHeaders.append("Connection", "keep-alive");
    myHeaders.append("Cookie", "m-login=1; m-b=5yRr0Zd9_T1XyAXoUvzOuQ==; m-b_lax=5yRr0Zd9_T1XyAXoUvzOuQ==; m-b_strict=5yRr0Zd9_T1XyAXoUvzOuQ==; m-s=tBYYe8tSW5S5KmJuiPb99g==; m-uid=2287745493; m-theme=light; m-dynamicFontSize=regular; m-themeStrategy=auto; g_state={\"i_p\":1725615800778,\"i_l\":1}; m-lat=jdU2VmBrc24d2y28eUDL81dpGtObc5U5emJN8J1Dag==; OptanonConsent=isGpcEnabled=0&datestamp=Sat+Oct+05+2024+11%3A01%3A35+GMT%2B0800+(%E4%B8%AD%E5%9B%BD%E6%A0%87%E5%87%86%E6%97%B6%E9%97%B4)&version=202312.1.0&browserGpcFlag=0&isIABGlobal=false&hosts=&landingPath=NotLandingPage&AwaitingReconsent=false&groups=C0001%3A1%2CC0002%3A1%2CC0003%3A1%2CC0004%3A1; OptanonAlertBoxClosed=2024-10-05T03:01:35.039Z; m-b=5yRr0Zd9_T1XyAXoUvzOuQ==; m-b_lax=5yRr0Zd9_T1XyAXoUvzOuQ==; m-b_strict=5yRr0Zd9_T1XyAXoUvzOuQ==; m-login=1; m-s=tBYYe8tSW5S5KmJuiPb99g==");
    myHeaders.append("Sec-Fetch-Dest", "empty");
    myHeaders.append("Sec-Fetch-Mode", "cors");
    myHeaders.append("Sec-Fetch-Site", "same-site");
    myHeaders.append("Priority", "u=0");
    myHeaders.append("content-length", request.headers.get("content-length"));
    myHeaders.append("content-type", request.headers.get("content-type"));

    console.log("request.headers :>>", request.headers);

    // 使用读取到的 bodyText 作为请求体
    const response = await fetch("https://upload.quora.com/_/imgupload/upload_POST", {
      method: "POST",
      headers: myHeaders,
      body: request.body, // 传递读取的请求体内容
      redirect: "follow",
    });

    // return response;
    const newresult = await response.text();
    return new Response(newresult, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': '*',
        'Access-Control-Allow-Methods': '*',
        'Access-Control-Max-Age': '86400',
      },
    })
  } else {
    return new Response(null, {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "*",
        "Access-Control-Allow-Methods": "*",
        "Access-Control-Max-Age": "86400",
      },
    });
  }
}
