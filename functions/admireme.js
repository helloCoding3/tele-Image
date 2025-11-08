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
  context.request;
  const url = new URL(request.url);
  console.log("request :>> ", request.method);
  // console.log('url :>> ', url);

  if (request.method == "POST") {
    const myHeaders = new Headers();
    myHeaders.append("Host", "admireme.vip");
    myHeaders.append(
      "User-Agent",
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:134.0) Gecko/20100101 Firefox/134.0"
    );
    myHeaders.append(
      "Accept",
      "application/json, text/javascript, */*; q=0.01"
    );
    myHeaders.append(
      "Accept-Language",
      "en-US,en;q=0.9,fr-FR;q=0.8,de-DE;q=0.7,es-ES;q=0.6,zh-CN;q=0.5,zh;q=0.4"
    );
    myHeaders.append("Accept-Encoding", "gzip, deflate, br, zstd");
    myHeaders.append("X-Requested-With", "XMLHttpRequest");
    myHeaders.append("Origin", "https://admireme.vip");
    myHeaders.append("Connection", "keep-alive");
    myHeaders.append("Referer", "https://admireme.vip/messages/896524/");
    const admireVIPcookie = await fetch(
      "https://videourlplay.pages.dev/data/admire_info.json"
    );
    const admireVIPcookieJson = await admireVIPcookie.json();
    myHeaders.append("Cookie", admireVIPcookieJson[0]["data"]["cookie"]);
    myHeaders.append("Sec-Fetch-Dest", "empty");
    myHeaders.append("Sec-Fetch-Mode", "cors");
    myHeaders.append("Sec-Fetch-Site", "same-origin");
    myHeaders.append("TE", "trailers");

    myHeaders.append("content-length", request.headers.get("content-length"));
    myHeaders.append("content-type", request.headers.get("content-type"));

    const requestBody = await request.arrayBuffer();
    const response = fetch("https://admireme.vip/messages/upload-photo/", {
      method: "POST",
      headers: myHeaders,
      body: requestBody,
      redirect: "follow",
    });
    return new Response((await response).body, {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "*",
        "Access-Control-Allow-Methods": "*",
        "Access-Control-Max-Age": "86400",
      },
    });
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
