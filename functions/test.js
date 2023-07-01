export async function onRequest(context) {  // Contents of context object  
  const {
    request, // same as existing Worker API    
    env, // same as existing Worker API    
    params, // if filename includes [id] or [[path]]   
    waitUntil, // same as ctx.waitUntil in existing Worker API    
    next, // used for middleware or to fetch assets    
    data, // arbitrary space for passing data between middlewares 
  } = context;
  context.request
  const url = new URL(request.url);
  console.log('request.body :>> ', request.body);
  console.log('url :>> ', url);

  const myHeaders = new Headers();
  myHeaders.append("Host", " api.huaban.com");
  myHeaders.append("User-Agent", " Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/115.0");
  myHeaders.append("Accept", " application/json, text/plain, */*");
  myHeaders.append("Accept-Language", " zh-CN,zh;q=0.8,zh-TW;q=0.7,zh-HK;q=0.5,en-US;q=0.3,en;q=0.2");
  myHeaders.append("Accept-Encoding", " gzip, deflate, br");
  myHeaders.append("Referer", " https://huaban.com/boards/83634854");
  myHeaders.append("Origin", " https://huaban.com");
  myHeaders.append("DNT", " 1");
  myHeaders.append("Connection", " keep-alive");
  myHeaders.append("Cookie", "gd_id=2023335602832821285; referer=https%3A%2F%2Fapi.huaban.com%2Fauth%2F; sid=s%3AzymY6q9wtojo5eR_0V8yPz_RTHVlZrV8.KK%2FFaJNJKaf6PlVvnzZP%2Boc0NVWHRO75YKWv91RgwNg; uid=35993302; gd_id=2023335602832821285; referer=https%3A%2F%2Fapi.huaban.com%2Fauth%2F; sid=s%3AzymY6q9wtojo5eR_0V8yPz_RTHVlZrV8.KK%2FFaJNJKaf6PlVvnzZP%2Boc0NVWHRO75YKWv91RgwNg; uid=35993302; acw_tc=0a6fc6e616881907209997778ebb824de0bfb6be6be147384d13384a1ff0e2; aliyungf_tc=aa576b61ebeb77d163bd60ac04be3ebe27750af0fa8829cb4e488e8009eed5a5");
  myHeaders.append("Sec-Fetch-Dest", " empty");
  myHeaders.append("Sec-Fetch-Mode", " cors");
  myHeaders.append("Sec-Fetch-Site", " same-site");
  myHeaders.append("TE", " trailers");

  // const formdata = new FormData();
  // formdata.append("", fileInput.files[0], "/H:/发的内容/2022年7月17日/京东快递小哥哥/13302517967235806.jpg");

  const requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: request.body
  };

  const response = fetch("https://api.huaban.com/upload", requestOptions);
  // const response = fetch('https://telegra.ph/' + url.pathname + url.search, {
  //   method: request.method,
  //   headers: request.headers,
  //   body: request.body,
  // });
  return response;
}
