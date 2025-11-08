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
    myHeaders.append("Host", "upload.uploadcare.com");
    myHeaders.append("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:134.0) Gecko/20100101 Firefox/134.0");
    myHeaders.append("Accept", "*/*");
    myHeaders.append("Accept-Language", "en-US,en;q=0.9,fr-FR;q=0.8,de-DE;q=0.7,es-ES;q=0.6,zh-CN;q=0.5,zh;q=0.4");
    myHeaders.append("Accept-Encoding", "gzip, deflate, br, zstd");
    myHeaders.append("Referer", "https://uploadcare.com/");
    myHeaders.append("X-UC-User-Agent", "blocks/1.2.0/197081507d1f618c7939 (JavaScript; Uploadcare-Site)");
    myHeaders.append("Origin", "https://uploadcare.com");
    myHeaders.append("Sec-Fetch-Dest", "empty");
    myHeaders.append("Sec-Fetch-Mode", "cors");
    myHeaders.append("Sec-Fetch-Site", "same-site");
    myHeaders.append("Connection", "keep-alive");
    myHeaders.append("content-length", request.headers.get("content-length"));
    myHeaders.append("content-type", request.headers.get("content-type"));

    console.log("request.headers :>>", request.headers);

    // 使用读取到的 bodyText 作为请求体
    const response = await fetch("https://upload.uploadcare.com/base/?jsonerrors=1", {
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
