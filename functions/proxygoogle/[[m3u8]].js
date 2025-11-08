export async function onRequestGet(context) {
  const { request, env, params, waitUntil, next, data } = context;
  const url = new URL(request.url);
  const needdealurl = "https://storage.googleapis.com" + context.functionPath;
  console.log("needdealurl :>> ", needdealurl);
  const proxyurl = needdealurl.replace("/proxygoogle", "");
  console.log("proxyurl :>> ", proxyurl);
  const startTime = Date.now();
  let response = await fetch(proxyurl, {
    method: request.method,
    headers: {
      Host: "storage.googleapis.com",
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:127.0) Gecko/20100101 Firefox/127.0",
      Accept: "*/*",
      "Accept-Language":
        "en-US,en;q=0.9,fr-FR;q=0.8,de-DE;q=0.7,es-ES;q=0.6,zh-CN;q=0.5,zh;q=0.4",
      "Accept-Encoding": "gzip, deflate, br, zstd",
      Origin: "https://storage.googleapis.com",
      Connection: "keep-alive",
      Referer: "https://storage.googleapis.com/",
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
  // console.log(`请求 ${context.functionPath} 耗时: ${duration}ms`);
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
}
