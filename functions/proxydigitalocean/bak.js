export async function onRequest(context) {
  const { request, env, params, waitUntil, next, data, functionPath } = context;
  const url = new URL(request.url);
  console.log("request.method :>> ", request.method);
  if (request.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "*",
        "Access-Control-Allow-Methods": "GET, OPTIONS",
        "Access-Control-Max-Age": "86400",
      },
    });
  } else if (request.method === "GET") {
    const needdealurl =
      "https://raf-static-prod.nyc3.digitaloceanspaces.com" +
      context.functionPath;
    console.log("needdealurl :>> ", needdealurl);
    const proxyurl = needdealurl.replace("/proxydigitalocean", "");
    console.log("proxyurl :>> ", proxyurl);
    const startTime = Date.now();
    let response = await fetch(proxyurl, {
      method: request.method,
      headers: {
        Host: "raf-static-prod.nyc3.digitaloceanspaces.com",
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:127.0) Gecko/20100101 Firefox/127.0",
        Accept: "*/*",
        "Accept-Language":
          "en-US,en;q=0.9,fr-FR;q=0.8,de-DE;q=0.7,es-ES;q=0.6,zh-CN;q=0.5,zh;q=0.4",
        "Accept-Encoding": "gzip, deflate, br, zstd",
        Origin: "https://raf-static-prod.nyc3.digitaloceanspaces.com",
        Connection: "keep-alive",
        Referer: "https://raf-static-prod.nyc3.digitaloceanspaces.com/",
        "Sec-Fetch-Dest": "empty",
        "Sec-Fetch-Mode": "cors",
        "Sec-Fetch-Site": "cross-site",
        TE: "trailers",
      },
      cf: {
        cacheTtl: 3600, // 缓存1小时
        cacheEverything: true,
      },
    });

    let processedContent;
    if (context.functionPath.endsWith(".m3u8")) {
      const m3u8Content = await response.text();
      // 处理M3U8文件中的TS路径
      processedContent = m3u8Content.replace(
        /https?:\/\/[^\s]+\.ts/g,
        (match) => match.split("/").pop() // 保留文件名作为相对路径
      );
    } else if (context.functionPath.endsWith(".ts")) {
      processedContent = await response.arrayBuffer();
    } else {
      processedContent = await response.text(); // 其他文件类型原样返回
    }

    const endTime = Date.now();
    const duration = endTime - startTime;
    console.log(`请求 ${context.functionPath} 耗时: ${duration}ms`);
    // 设置响应头（包括CORS和缓存控制）
    const headers = new Headers({
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "*",
      "Access-Control-Allow-Methods": "*",
      "Access-Control-Max-Age": "86400",
      "Cache-Control": "public, max-age=3600", // 浏览器缓存1小时
      "Content-Type":
        response.headers.get("Content-Type") ||
        (context.functionPath.endsWith(".m3u8")
          ? "application/x-mpegURL"
          : "video/MP2T"),
      "X-Spend-Time": `${duration}ms`,
    });

    return new Response(processedContent, {
      status: response.status,
      headers,
    });
  } else if (request.method === "POST") {
    const body = await request.arrayBuffer();
    const proxyUrl =
      "https://raf-static-prod.nyc3.digitaloceanspaces.com" +
      functionPath +
      url.search;
    const targetUrl = proxyUrl.replace("/proxydigitalocean", "");

    // const targetUrl =
    // "https://raf-static-prod.nyc3.digitaloceanspaces.com/tmp/0c4cd970-89e1-4af7-bc31-2a794fd591be.png?X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=DO00TEYR4B4H496Y6NGK%2F20250716%2Fnyc3%2Fs3%2Faws4_request&X-Amz-Date=20250716T010557Z&X-Amz-SignedHeaders=host&X-Amz-Expires=1200&X-Amz-Signature=57ec744c1b8116bd778cf1d842617b553e0e26d2a3ddcac0a8c5452657d5327c";

    const myHeaders = new Headers();
    myHeaders.append("Host", "raf-static-prod.nyc3.digitaloceanspaces.com");
    myHeaders.append(
      "User-Agent",
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:141.0) Gecko/20100101 Firefox/141.0"
    );
    myHeaders.append("Accept", "application/json, text/plain, */*");
    myHeaders.append("Accept-Language", "en-US,en;q=0.5");
    myHeaders.append("Accept-Encoding", "gzip, deflate, br, zstd");
    myHeaders.append("X-Requested-With", "XMLHttpRequest");
    myHeaders.append("x-amz-acl", "public-read");
    myHeaders.append("Origin", "https://www.realadult.fans");
    myHeaders.append("Connection", "keep-alive");
    myHeaders.append("Referer", "https://www.realadult.fans/");
    myHeaders.append("content-length", request.headers.get("content-length"));
    myHeaders.append("content-type", request.headers.get("content-type"));

    const requestOptions = {
      method: "PUT",
      headers: myHeaders,
      body: body,
      redirect: "follow",
    };

    const response = await fetch(targetUrl, requestOptions);
    // console.log("response :>> ", response);
    // 获取返回的状态信息
    console.log("response.status,,", response.status);
    const tipsinfo = {
      status: response.status,
      message: "UPLOAD SUCCESS",
      url: (
        "https://raf-static-prod.nyc3.digitaloceanspaces.com" + functionPath
      ).replace("/proxydigitalocean", ""),
    };
    return new Response(JSON.stringify(tipsinfo), {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "*",
        "Access-Control-Allow-Methods": "*",
        "Access-Control-Max-Age": "86400",
      },
    });
  }
  // 返回非法请求
  else
    return new Response("Method Not Allowed", {
      status: 405,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "*",
        "Access-Control-Allow-Methods": "*",
        "Access-Control-Max-Age": "86400",
      },
    });
}
