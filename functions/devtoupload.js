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
    myHeaders.append("Host", "dev.to");
    myHeaders.append(
      "User-Agent",
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:131.0) Gecko/20100101 Firefox/131.0"
    );
    myHeaders.append("Accept", "*/*");
    myHeaders.append(
      "Accept-Language",
      "en-US,en;q=0.9,fr-FR;q=0.8,de-DE;q=0.7,es-ES;q=0.6,zh-CN;q=0.5,zh;q=0.4"
    );
    myHeaders.append("Accept-Encoding", "gzip, deflate, br, zstd");
    myHeaders.append("Origin", "https://dev.to");
    myHeaders.append("Connection", "keep-alive");
    myHeaders.append(
      "Cookie",
      "_Devto_Forem_Session=443c29d5a6a228a5eee2f1626e2debb8; remember_user_token=eyJfcmFpbHMiOnsibWVzc2FnZSI6Ilcxc3lNVFV3TVRnMFhTd2lTRk42UkRoQ2MxZEhObmxXYlhKSU9FRnhRa01pTENJeE56STNOell4TmpFNExqZzNNamM1TVRVaVhRPT0iLCJleHAiOiIyMDI1LTA0LTAxVDA1OjQ2OjU4Ljg3MloiLCJwdXIiOiJjb29raWUucmVtZW1iZXJfdXNlcl90b2tlbiJ9fQ%3D%3D--daa9b820284cac0b58a566675e1a3e53ee95a16a; ahoy_visit=8d956a0c-48cf-47a0-bae1-f78313779592; ahoy_visitor=6b15165d-41c1-4945-88d8-e8817f678516; _Devto_Forem_Session=443c29d5a6a228a5eee2f1626e2debb8"
    );
    myHeaders.append("Sec-Fetch-Dest", "empty");
    myHeaders.append("Sec-Fetch-Mode", "cors");
    myHeaders.append("Sec-Fetch-Site", "same-origin");
    myHeaders.append("content-length", request.headers.get("content-length"));
    myHeaders.append("content-type", request.headers.get("content-type"));

    const response = fetch("https://dev.to/image_uploads", {
      method: 'POST',
      headers: myHeaders,
      body: request.body,
      redirect: 'follow'
    });
    return response;
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
