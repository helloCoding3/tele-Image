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
  context.request;
  const url = new URL(request.url);
  console.log("request :>> ", request.method);
  // console.log('url :>> ', url);

  if (request.method == "POST") {
    const body = await request.arrayBuffer(); // 保留原始上传内容
    const remoteurl = "https://imageproxy3.pages.dev/realmeupload";

    const myHeaders = new Headers();
    myHeaders.append(
      "User-Agent",
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:142.0) Gecko/20100101 Firefox/142.0"
    );
    myHeaders.append("Accept", "*/*");
    myHeaders.append("Accept-Language", "en-US,en;q=0.5");
    myHeaders.append("Accept-Encoding", "gzip, deflate, br, zstd");
    myHeaders.append("Connection", "keep-alive");
    myHeaders.append("proxy-cookie", request.headers.get("proxy-cookie"));
    myHeaders.append("Content-Type", request.headers.get("content-type"));
    myHeaders.append("Content-Length", request.headers.get("content-length"));

    // 发送到 realadult
    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: body,
      redirect: "follow",
    };

    // 发送到 realadult
    const upstreamRes = await fetch(remoteurl, requestOptions);

    return new Response(upstreamRes.body, {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "*",
        "Access-Control-Allow-Methods": "*",
        "Access-Control-Max-Age": "86400",
      },
    });

    // const failedtips = {
    //   message: "OK FINE",
    //   status: 200,
    // };
    // return new Response("OK", {
    //   status: 200,
    //   headers: {
    //     "Access-Control-Allow-Origin": "*",
    //     "Access-Control-Allow-Headers": "*",
    //     "Access-Control-Allow-Methods": "*",
    //     "Access-Control-Max-Age": "86400",
    //   },
    // });
  }
  if (request.method == "PUT") {
    const body = await request.arrayBuffer();
    const proxyUrl =
      "https://imageproxy3.pages.dev/proxydigitalocean" + functionPath + url.search;
    const targetUrl = proxyUrl.replace("/getrealmeuploadcf", "");
    console.log("targetUrl :>> ", targetUrl);
    const myHeaders = new Headers();
    myHeaders.append(
      "User-Agent",
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:141.0) Gecko/20100101 Firefox/141.0"
    );
    myHeaders.append("Accept", "application/json, text/plain, */*");
    myHeaders.append("Accept-Language", "en-US,en;q=0.5");
    myHeaders.append("X-Requested-With", "XMLHttpRequest");
    myHeaders.append("Connection", "keep-alive");
    myHeaders.append("content-length", request.headers.get("content-length"));
    myHeaders.append("content-type", request.headers.get("content-type"));

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: body,
      redirect: "follow",
    };

    const response = await fetch(targetUrl, requestOptions);
    console.log("response.status (upload)", response.status);
    const result = await response.json();
    // console.log("result (upload) :>> ", result);

    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "*",
      "Access-Control-Allow-Methods": "*",
      "Access-Control-Max-Age": "86400",
    };


    return new Response(JSON.stringify(result), {
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
