export async function onRequest(context) {
  // Contents of context object
  const {
    request, // same as existing Worker API
    env, // same as existing Worker API
    params, // if filename includes [id] or [[path]]
    waitUntil, // same as ctx.waitUntil in existing Worker API
    next, // used for middleware or to fetch assets
    data, // arbitrary space for passing data between middlewares
    functionPath, // path to the current function
  } = context;

  const url = new URL(request.url);
  console.log("request :>> ", request.method);
  const body = await request.arrayBuffer();
  if (request.method === "GET") {
    const myHeaders = new Headers();
    myHeaders.append("Host", "api.paperguide.ai");
    myHeaders.append(
      "User-Agent",
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:142.0) Gecko/20100101 Firefox/142.0"
    );
    myHeaders.append("Accept", "application/json, text/plain, */*");
    myHeaders.append("Accept-Language", "en-US,en;q=0.5");
    myHeaders.append("Origin", "https://humanizeai.com");
    myHeaders.append("Connection", "keep-alive");
    myHeaders.append("Referer", "https://humanizeai.com/");
    myHeaders.append("Sec-Fetch-Dest", "empty");
    myHeaders.append("Sec-Fetch-Mode", "cors");
    myHeaders.append("Sec-Fetch-Site", "cross-site");
    myHeaders.append("TE", "trailers");
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      file_name: "image.png",
      container_name: "writer-images",
      browser_id: generateUUIDv4(),
    });

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    // 使用读取到的 bodyText 作为请求体
    const response = await fetch(
      "https://api.paperguide.ai/v2/generate/upload-url",
      requestOptions
    );

    // return response;
    const newresult = await response.json();
    console.log("newresult :>> ", newresult);
    return new Response(JSON.stringify(newresult), {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "*",
        "Access-Control-Allow-Methods": "*",
        "Access-Control-Max-Age": "86400",
      },
    });
  }
  if (request.method === "PUT") {
    const needdealurl =
      "https://chatwithpdfai.blob.core.windows.net" + functionPath + url.search;
    const proxyurl = needdealurl.replace("/proxypaperguide", "");
    const myHeaders = new Headers();
    myHeaders.append("Host", "chatwithpdfai.blob.core.windows.net");
    myHeaders.append(
      "User-Agent",
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:142.0) Gecko/20100101 Firefox/142.0"
    );
    myHeaders.append("Accept", "application/json, text/plain, */*");
    myHeaders.append("Accept-Language", "en-US,en;q=0.5");
    myHeaders.append("Accept-Encoding", "gzip, deflate, br, zstd");
    myHeaders.append("x-ms-blob-type", "BlockBlob");
    myHeaders.append("Origin", "https://humanizeai.com");
    myHeaders.append("Connection", "keep-alive");
    myHeaders.append("Referer", "https://humanizeai.com/");
    myHeaders.append("Sec-Fetch-Dest", "empty");
    myHeaders.append("Sec-Fetch-Mode", "cors");
    myHeaders.append("Sec-Fetch-Site", "cross-site");
    myHeaders.append("content-length", request.headers.get("content-length"));
    myHeaders.append("content-type", request.headers.get("content-type"));

    const requestOptions = {
      method: "PUT",
      headers: myHeaders,
      body: body, // 传递读取的请求体内容
      redirect: "follow",
    };

    // 使用读取到的 bodyText 作为请求体
    const response = await fetch(proxyurl, requestOptions);
    // 获取返回的状态信息
    console.log("response.status,,", response.status);
    const tipsinfo = {
      status: response.status,
      message: "UPLOAD SUCCESS",
      url: (
        "https://chatwithpdfai.blob.core.windows.net" + functionPath
      ).replace("/proxypaperguide", ""),
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

// 生成随机 UUID v4
function generateUUIDv4() {
  return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
    (
      c ^
      (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
    ).toString(16)
  );
}
