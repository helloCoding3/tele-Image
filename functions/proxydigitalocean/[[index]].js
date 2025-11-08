export async function onRequest(context) {
  const { request, functionPath } = context;
  const url = new URL(request.url);

  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "*",
    "Access-Control-Allow-Methods": "*",
    "Access-Control-Max-Age": "86400",
  };

  if (request.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: corsHeaders,
    });
  }

  if (request.method === "GET") {
    const proxyBase = "https://raf-static-prod.nyc3.digitaloceanspaces.com";
    const proxyURL = (proxyBase + functionPath).replace("/proxydigitalocean", "");

    const cacheKey = new Request(request.url, request);
    const cache = caches.default;

    let cached = await cache.match(cacheKey);
    if (cached) {
      return cached;
    }

    const startTime = Date.now();
    const originResponse = await fetch(proxyURL, {
      method: "GET",
      headers: {
        Host: "raf-static-prod.nyc3.digitaloceanspaces.com",
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:127.0) Gecko/20100101 Firefox/127.0",
        Accept: "*/*",
        "Accept-Language": "en-US,en;q=0.9",
        "Accept-Encoding": "gzip, deflate, br, zstd",
        Origin: proxyBase,
        Referer: proxyBase + "/",
      },
      cf: {
        cacheTtl: 3600,
        cacheEverything: true,
      },
    });

    let processedContent;
    let contentType =
      originResponse.headers.get("Content-Type") || "application/octet-stream";

    if (functionPath.endsWith(".m3u8")) {
      const m3u8 = await originResponse.text();
      processedContent = m3u8.replace(
        /https?:\/\/[^\s]+\.ts/g,
        (match) => match.split("/").pop()
      );
      contentType = "application/x-mpegURL";
    } else if (functionPath.endsWith(".ts")) {
      processedContent = await originResponse.arrayBuffer();
      contentType = "video/MP2T";
    } else {
      processedContent = await originResponse.text();
    }

    const duration = Date.now() - startTime;

    const headers = new Headers({
      ...corsHeaders,
      "Cache-Control": "public, max-age=3600",        // 浏览器缓存
      "CDN-Cache-Control": "public, max-age=86400",   // Cloudflare 缓存
      "Content-Type": contentType,
      "X-Spend-Time": `${duration}ms`,
    });

    const finalResponse = new Response(processedContent, {
      status: originResponse.status,
      headers,
    });

    // 手动写入 Cloudflare 缓存（关键！否则 cf-cache-status 仍为 DYNAMIC）
    context.waitUntil(cache.put(cacheKey, finalResponse.clone()));

    return finalResponse;
  }

  // ✅ 完整还原你原始 POST 上传逻辑
  if (request.method === "POST") {
    const body = await request.arrayBuffer();
    const proxyUrl =
      "https://raf-static-prod.nyc3.digitaloceanspaces.com" +
      functionPath +
      url.search;
    const targetUrl = proxyUrl.replace("/proxydigitalocean", "");

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
    console.log("response.status (upload)", response.status);

    const tipsinfo = {
      status: response.status,
      message: "UPLOAD SUCCESS",
      url: (
        "https://raf-static-prod.nyc3.digitaloceanspaces.com" + functionPath
      ).replace("/proxydigitalocean", ""),
    };
    return new Response(JSON.stringify(tipsinfo), {
      status: 200,
      headers: corsHeaders,
    });
  }

  // 非法请求
  return new Response("Method Not Allowed", {
    status: 405,
    headers: corsHeaders,
  });
}
