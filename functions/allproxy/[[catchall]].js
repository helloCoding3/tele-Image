export async function onRequest(context) {
  const { request, params } = context;

  // 确保 params.catchall 是有效的数组
  if (!params.catchall || !Array.isArray(params.catchall)) {
    return new Response("Invalid URL format or catchall not found", {
      status: 400,  // Bad Request
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "*",
        "Access-Control-Allow-Methods": "*",
        "Access-Control-Max-Age": "86400",
      },
    });
  }

  // 获取目标主机和路径部分
  const targetHost = params.catchall[0];  // 主机部分，例如 'static.dzine.ai'
  const targetPath = params.catchall.slice(1).join('/');  // 剩余路径部分，例如 'stylar_product/p/0/new_canvas_layer/1740379742481_kyDU8r8L_jb9gn.m3u8'
  
  // 获取当前请求的 Host，从请求头中获取
  const currentHost = request.headers.get("Host");
  if (!currentHost) {
    return new Response("Missing Host header", {
      status: 400,  // Bad Request
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "*",
        "Access-Control-Allow-Methods": "*",
        "Access-Control-Max-Age": "86400",
      },
    });
  }

  // 构造目标 URL，动态使用请求的 Host
  const targetUrl = `https://${targetHost}/${targetPath}`;

  // 处理 CORS 预检请求（OPTIONS）
  if (request.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "*",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Max-Age": "86400",
      },
    });
  }

  // 处理 GET 请求，代理 m3u8 或其他内容
  if (request.method === "GET") {
    let response;
    try {
      // 代理目标 URL
      response = await fetch(targetUrl, {
        method: "GET",
        headers: request.headers,
        redirect: "follow",  // 允许重定向
      });

      // 检查响应类型，判断是否是 m3u8 文件
      if (response.headers.get("Content-Type")?.includes("application/vnd.apple.mpegurl")) {
        let m3u8Content = await response.text();
        
        // 替换 m3u8 文件中的相对 TS URL
        m3u8Content = m3u8Content.replace(
          /(^#EXTINF:[^,]+,)([^#\n]+)/g,  // 匹配 EXTINF 行
          (match, p1, p2) => {
            // 如果 TS URL 是相对路径（不以 http:// 或 https:// 开头）
            if (!p2.startsWith("http://") && !p2.startsWith("https://")) {
              // 构造完整的 TS URL，代理路径
              const fullTsUrl = `https://${currentHost}/allproxy/${encodeURIComponent(new URL(p2, targetUrl).href)}`;
              return `${p1}${fullTsUrl}`;  // 使用完整的代理 URL 替换相对路径
            }
            return match;  // 如果已经是绝对 URL，保持不变
          }
        );

        // 返回修改后的 m3u8 内容
        return new Response(m3u8Content, {
          status: 200,
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "*",
            "Access-Control-Allow-Methods": "*",
            "Access-Control-Max-Age": "86400",
            "Content-Type": "application/vnd.apple.mpegurl",
          },
        });
      }

      // 对于其他类型的文件（如 ts 文件），直接返回原始内容
      const contentType = response.headers.get("Content-Type") || "application/octet-stream";
      return new Response(response.body, {
        status: response.status,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Headers": "*",
          "Access-Control-Allow-Methods": "*",
          "Access-Control-Max-Age": "86400",
          "Content-Type": contentType,
        },
      });
    } catch (error) {
      console.error("Error while proxying request: ", error);
      return new Response("Error while proxying request", {
        status: 500,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Headers": "*",
          "Access-Control-Allow-Methods": "*",
          "Access-Control-Max-Age": "86400",
        },
      });
    }
  }

  // 如果请求方法不是 GET 或 OPTIONS，返回 405
  return new Response("Method Not Allowed", {
    status: 405,  // Method Not Allowed
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "*",
      "Access-Control-Allow-Methods": "*",
      "Access-Control-Max-Age": "86400",
    },
  });
}
