export async function onRequestGet(context) {
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
  console.log("url :>> ", url);
  const proxyurl = "https://dms.mydukaan.io" + context.functionPath;
  console.log("proxyurl :>> ", proxyurl);
  const response = await fetch(proxyurl, {
    method: request.method,
    headers: {
      Host: "dms.mydukaan.io",
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:127.0) Gecko/20100101 Firefox/127.0",
      Accept: "*/*",
      "Accept-Language":
        "zh-CN,zh;q=0.8,zh-TW;q=0.7,zh-HK;q=0.5,en-US;q=0.3,en;q=0.2",
      "Accept-Encoding": "gzip, deflate, br, zstd",
      Origin: "https://dms.mydukaan.io",
      Connection: "keep-alive",
      Referer: "https://dms.mydukaan.io/",
      "Sec-Fetch-Dest": "empty",
      "Sec-Fetch-Mode": "cors",
      "Sec-Fetch-Site": "cross-site",
      TE: "trailers",
    },
  });
  // console.log('response :>> ', response);

  // 如果是m3u8,那么返回.text()
  // 如果是ts，那么返回.arrayBuffer()
  let newresult = "";
  // console.log("context.functionPath :>> ", context.functionPath);
  if (/(.m3u8)/.test(context.functionPath)) {
    newresult = await response.text();
  } else {
    newresult = await response.arrayBuffer();
  }
  return new Response(newresult, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "*",
      "Access-Control-Allow-Methods": "*",
      "Access-Control-Max-Age": "86400",
    },
  });
}
