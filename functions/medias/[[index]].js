export async function onRequestGet(context) {
  const { request, functionPath } = context;
  const url = new URL(request.url);
  console.log("Request URL:", url.href);

  const proxyBase = "https://files.uplust.com";
  // 拼出目标 URL，例如：
  // /medias/pics/fullres/67e4be016b00afe07b5c911b.mp4
  const proxyURL = proxyBase + functionPath.replace(".mp4", "");
  console.log("Proxy target:", proxyURL);

  // 代理请求目标资源
  const upstreamResponse = await fetch(proxyURL, {
    method: request.method,
    headers: request.headers,
  });

  // 允许跨域播放和缓存策略
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "*",
    "Access-Control-Allow-Methods": "*",
    "Access-Control-Max-Age": "86400",
  };

  // 复制原始响应的头部
  const newHeaders = new Headers(upstreamResponse.headers);

  // 替换或添加必要的头部
  newHeaders.set("Content-Type", "video/mp4");
  newHeaders.set("Cache-Control", "public, max-age=3600");
  newHeaders.set("CDN-Cache-Control", "public, max-age=86400");
  newHeaders.set("X-Proxy-By", "Cloudflare Functions");

  // 合并 CORS 头
  for (const [k, v] of Object.entries(corsHeaders)) {
    newHeaders.set(k, v);
  }

  // 返回原始响应体（流式转发）
  return new Response(upstreamResponse.body, {
    status: upstreamResponse.status,
    headers: newHeaders,
  });
}
