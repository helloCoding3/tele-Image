export async function onRequest(context) {
  // Contents of context object
  const {
    request, // same as existing Worker API
    env, // same as existing Worker API
    params, // if filename includes [id] or [[path]]
    waitUntil, // same as ctx.waitUntil in existing Worker API
    next, // used for middleware or to fetch assets
    data, // arbitrary space for passing data between middlewares
    functionPath,
  } = context;

  const url = new URL(request.url);
  console.log("request :>> ", request.method);

  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "*",
    "Access-Control-Allow-Methods": "*",
    "Access-Control-Max-Age": "86400",
  };

  if (request.method === "POST") {
    const body = await request.arrayBuffer();
    const myHeaders = new Headers();
    myHeaders.append("Host", "videoplus.ai");
    myHeaders.append(
      "User-Agent",
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:142.0) Gecko/20100101 Firefox/142.0"
    );
    myHeaders.append("Accept", "application/json");
    myHeaders.append("Accept-Language", "en-US,en;q=0.5");
    myHeaders.append("Referer", "https://videoplus.ai/reference-to-video");
    myHeaders.append("Origin", "https://videoplus.ai");
    myHeaders.append("Connection", "keep-alive");
    myHeaders.append(
      "Cookie",
      "NUXT_LOCALE=en; user_id=608b9ae1-9f11-4986-9602-c50827163ce2"
    );
    myHeaders.append("Sec-Fetch-Dest", "empty");
    myHeaders.append("Sec-Fetch-Mode", "no-cors");
    myHeaders.append("Sec-Fetch-Site", "same-origin");
    myHeaders.append("TE", "trailers");
    myHeaders.append("Priority", "u=4");
    myHeaders.append("Pragma", "no-cache");
    myHeaders.append("Cache-Control", "no-cache");
    myHeaders.append("content-length", request.headers.get("content-length"));
    myHeaders.append("content-type", request.headers.get("content-type"));

    console.log("request.headers :>>", request.headers);

    // 使用读取到的 bodyText 作为请求体
    const response = await fetch(
      "https://videoplus.ai/veo2/api/get_oss_signed_urls",
      {
        method: "POST",
        headers: myHeaders,
        body: body, // 传递读取的请求体内容
        redirect: "follow",
      }
    );

    // return response;
    const newresult = await response.text();
    return new Response(newresult, {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "*",
        "Access-Control-Allow-Methods": "*",
        "Access-Control-Max-Age": "86400",
      },
    });
  } else if (request.method === "PUT") {
    const body = await request.arrayBuffer();
    const myHeaders = new Headers();
    const proxyUrl =
      "https://6877db7087ca0b142505956ca7012296.r2.cloudflarestorage.com" +
      functionPath +
      url.search;

    const targetUrl = proxyUrl.replace("/proxyvideoplus", "");
    console.log("targetUrl :>> ", targetUrl);
    myHeaders.append(
      "Host",
      "6877db7087ca0b142505956ca7012296.r2.cloudflarestorage.com"
    );
    myHeaders.append(
      "User-Agent",
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:142.0) Gecko/20100101 Firefox/142.0"
    );
    myHeaders.append("Accept", "*/*");
    myHeaders.append("Accept-Language", "en-US,en;q=0.5");
    myHeaders.append("Accept-Encoding", "gzip, deflate, br, zstd");
    myHeaders.append("Referer", "https://videoplus.ai/");
    myHeaders.append("Origin", "https://videoplus.ai");
    myHeaders.append("Connection", "keep-alive");
    myHeaders.append("Sec-Fetch-Dest", "empty");
    myHeaders.append("Sec-Fetch-Mode", "cors");
    myHeaders.append("Sec-Fetch-Site", "cross-site");
    myHeaders.append("Priority", "u=4");
    myHeaders.append("content-length", request.headers.get("content-length"));
    myHeaders.append("content-type", request.headers.get("content-type"));

    console.log("request.headers :>>", request.headers);

    // 使用读取到的 bodyText 作为请求体
    const response = await fetch(targetUrl, {
      method: "PUT",
      headers: myHeaders,
      body: body, // 传递读取的请求体内容
      redirect: "follow",
    });

    console.log("response.status (upload)", response.status);

    const tipsinfo = {
      status: response.status,
      message:
        response.status === 200 || response.status === 201
          ? "UPLOAD SUCCESS"
          : "UPLOAD FAILED",
      url: ("https://result.videoplus.ai" + functionPath).replace(
        "/proxyvideoplus/result-veo2",
        ""
      ),
    };
    return new Response(JSON.stringify(tipsinfo), {
      status: 200,
      headers: corsHeaders,
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
