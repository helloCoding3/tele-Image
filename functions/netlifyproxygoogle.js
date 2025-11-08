// netlify/functions/proxygoogle.js

exports.handler = async (event, context) => {
  const path = event.path.replace('/.netlify/functions/netlifyproxygoogle', '');
  const needdealurl = "https://storage.googleapis.com" + path;
  console.log("needdealurl :>> ", needdealurl);
  const proxyurl = needdealurl;
  
  const startTime = Date.now();
  
  try {
    let response = await fetch(proxyurl, {
      method: event.httpMethod,
      headers: {
        Host: "storage.googleapis.com",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:127.0) Gecko/20100101 Firefox/127.0",
        Accept: "*/*",
        "Accept-Language": "en-US,en;q=0.9,fr-FR;q=0.8,de-DE;q=0.7,es-ES;q=0.6,zh-CN;q=0.5,zh;q=0.4",
        "Accept-Encoding": "gzip, deflate, br",
        Origin: "https://storage.googleapis.com",
        Connection: "keep-alive",
        Referer: "https://storage.googleapis.com/",
        "Sec-Fetch-Dest": "empty",
        "Sec-Fetch-Mode": "cors",
        "Sec-Fetch-Site": "cross-site",
      }
    });

    let processedContent;
    let contentType;
    
    if (path.endsWith(".m3u8")) {
      const m3u8Content = await response.text();
      // 处理M3U8文件中的TS路径
      processedContent = m3u8Content.replace(
        /https?:\/\/[^\s]+\.ts/g,
        (match) => {
          const tsName = match.split("/").pop();
          return `${tsName}`;
        }
      );
      contentType = "application/x-mpegURL";
    } 
    else if (path.endsWith(".ts")) {
      processedContent = await response.arrayBuffer();
      contentType = "video/MP2T";
    } 
    else {
      processedContent = await response.text();
      contentType = response.headers.get("Content-Type") || "text/plain";
    }

    const endTime = Date.now();
    const duration = endTime - startTime;

    const headers = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "*",
      "Access-Control-Allow-Methods": "*",
      "Access-Control-Max-Age": "86400",
      "Cache-Control": "public, max-age=3600",
      "Content-Type": contentType,
      "X-Spend-Time": `${duration}ms`,
    };

    return {
      statusCode: response.status,
      headers,
      body: processedContent instanceof ArrayBuffer 
        ? Buffer.from(processedContent).toString('base64') 
        : processedContent,
      isBase64Encoded: processedContent instanceof ArrayBuffer
    };
    
  } catch (error) {
    console.error("Proxy error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Internal Server Error" })
    };
  }
};