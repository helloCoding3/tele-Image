export async function onRequestPost(context) {
  const { request } = context;

  const body = await request.arrayBuffer();
    const proxyUrl =
      "https://raf-static-prod.nyc3.digitaloceanspaces.com" +
      functionPath +
      url.search;

    const needreplacestr = "/rafstaticupload";
    const targetUrl = proxyUrl.replace(needreplacestr, "");

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
      ).replace(needreplacestr, ""),
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
