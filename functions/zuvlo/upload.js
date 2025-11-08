export async function onRequest(context) {
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
  console.log("url :>> ", url);
  // 处理 CORS 预检请求
  if (request.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "*",
        "Access-Control-Allow-Methods": "PUT, POST, OPTIONS",
        "Access-Control-Max-Age": "86400",
      },
    });
  }

  // 处理 POST 请求
  if (request.method === "POST") {
    const body = await request.arrayBuffer(); // 保留原始上传内容
    // const proxyurl = request.headers.get("x-proxy-url");
    const remoteurl = "https://api.zuvlo.com/users/avatar/upload";
    // console.log("needproxyurl :>> ", needproxyurl);
    const proxyHeaders = new Headers({
      Host: "api.zuvlo.com",
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:135.0) Gecko/20100101 Firefox/135.0",
      Accept: "*/*",
      "Accept-Language": "en-US,en;q=0.5",
      "Accept-Encoding": "gzip, deflate, br, zstd",
      "X-Requested-With": "XMLHttpRequest",
      authorization: request.headers.get("authorization"),
      Origin: "https://zuvlo.com",
      Connection: "keep-alive",
      Referer: "https://zuvlo.com/",
      "Sec-Fetch-Dest": "empty",
      "Sec-Fetch-Mode": "cors",
      "Sec-Fetch-Site": "same-site",
      "Content-Type":
        request.headers.get("content-type") || "application/octet-stream",
      "Content-Length":
        request.headers.get("content-length") || body.byteLength.toString(),
    });
    console.log("request.headers :>> ", request.headers);
    console.log("proxyHeaders :>> ", proxyHeaders);

    const upstreamRes = await fetch(remoteurl, {
      method: "POST",
      headers: proxyHeaders,
      body,
      redirect: "follow",
    });

    return new Response(upstreamRes.body, {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "*",
        "Access-Control-Allow-Methods": "*",
        "Access-Control-Max-Age": "86400",
      },
    });

    // return new Response(body, {
    //   status: 200,
    //   headers: {
    //     "Access-Control-Allow-Origin": "*",
    //     "Access-Control-Allow-Headers": "*",
    //     "Access-Control-Allow-Methods": "*",
    //     "Access-Control-Max-Age": "86400",
    //   },
    // });
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
