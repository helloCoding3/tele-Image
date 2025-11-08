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
  // console.log('request.headers :>> ', request.headers);
  // console.log('url :>> ', url);

  const cookieresponse = await fetch("https://videourlplay.pages.dev/data/workwxdoc_info.json")
  const result = await cookieresponse.text();
  console.log('获取企业微信token情况 :>> ', result);
  const jsonres = JSON.parse(result);
  const coo = jsonres[0]['data']['Cookie'];
  //   const re = /(wedrive_uin=)(.){17}/ig;
  const wedrive_uin = coo.match(/(wedrive_uin=)(.){17}/ig);
  const wedrive_sid = coo.match(/(wedrive_sid=)(.){24}/ig);
  const wedrive_sids = coo.match(/(wedrive_sids=)(.){42}/ig);
  const wedrive_skey = coo.match(/(wedrive_skey=)(.){50}/ig);
  const wedrive_ticket = coo.match(/(wedrive_ticket=)(.){66}/ig);
  const newcookie = `${wedrive_uin[0]};${wedrive_sid[0]};${wedrive_sids[0]};${wedrive_skey[0]};${wedrive_ticket[0]}`;
  console.log('\n newcookie :>> ', newcookie);
  if (request.method == 'POST') {
    var myHeaders = new Headers();
    myHeaders.append("Host", "doc.weixin.qq.com");
    myHeaders.append("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/116.0");
    myHeaders.append("Accept", "*/*");
    myHeaders.append("Accept-Language", "en-US,en;q=0.9,fr-FR;q=0.8,de-DE;q=0.7,es-ES;q=0.6,zh-CN;q=0.5,zh;q=0.4");
    myHeaders.append("Accept-Encoding", "gzip, deflate, br");
    myHeaders.append("Referer", "https://doc.weixin.qq.com/");
    myHeaders.append("Origin", "https://doc.weixin.qq.com");
    myHeaders.append("Connection", "keep-alive");
    myHeaders.append("Sec-Fetch-Dest", "empty");
    myHeaders.append("Sec-Fetch-Mode", "cors");
    myHeaders.append("Sec-Fetch-Site", "same-origin");
    myHeaders.append("TE", "trailers");


    myHeaders.append("content-length", request.headers.get('content-length'));
    myHeaders.append("content-type", request.headers.get('content-type'));
    myHeaders.append("Cookie", coo);

    // myHeaders.append("Cookie", "RK=aX8R1QjYfD; ptcz=eb4cd5fa9f7a765c9d6178948f202287d94c80b9eea29fbb3e981e5879e0eaf1; tvfe_boss_uuid=443b78937574795a; pgv_pvid=1355659167; pac_uid=1_2332454261; fqm_pvqid=1fa971bd-e9ba-4b40-962f-c7ab5b09a8f7; _clck=3922386436|1|fjx|0; iip=0; qq_domain_video_guid_verify=31d8228604b21eec; o_cookie=2332454261; _qimei_uuid42=17b09132a20100aa17da1b089aa66b875c31754959; _qimei_fingerprint=6fd7753a730726007bad48de10431a2e; _qimei_q36=; _qimei_h38=e06d034a93f033e1b4a3f2af02000001417819; fingerprint=fe867f314e1d4850835d8d6e0753246487; __root_domain_v=.weixin.qq.com; _qddaz=QD.359407458604495; eas_sid=T1O7c097k6w2W2c060T8Q2N5J5; o2_uin=2332454261; ETCI=11e14199a0674d51a02538425111d381; logTrackKey=d0f10fa3120f475ebad10684e7f81529; pgv_pvi=2903700480; wedrive_uin=13102662991084042; wedrive_sid=zQpmZYz6c3YuMWxMAHU3cwAA; wedrive_sids=13102663357328757&zXU4NoxtcmkuBm1jAItBYwAA|13102661368238119&zSdDYoxQUkgud2ttABRlQwAA|13102662991084042&zQpmZYz6c3YuMWxMAHU3cwAA; wedrive_skey=13102663357328757&8c1aa1e51f7bcdeaf35529c40a4fd355|13102661368238119&2bce9515da319476b0bd9d81e814e2ff|13102662991084042&7338f875c0d56d033c1b6de7dc56d388; wedrive_ticket=13102663357328757&CAESIBKNCuMCk0ssILW2QaRrO-1TthrZFQhD_YSNu__IMtul|13102661368238119&CAESINkfUf2endor3g-E1AEJAAbkrrgR3Cu31JguTtsXv8Tr|13102662991084042&CAESID9uWmnJxJ58JG3ThY-KwGdT3INgRNHUBlt3GSd9ew9A; xm_disk_vid=0; xm_disk_corp_id=0; uid=13102662991084042; uid_key=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJWSUQiOiIxMzEwMjY2Mjk5MTA4NDA0MiIsIlRpbnlJRCI6IjAiLCJTaWciOiIiLCJleHAiOjE3MTM5NDUyMTAsImlzcyI6IlRlbmNlbnQgT2ZmaWNlIn0._sDYN7y9XDpd7bNAi4TzlviAin2VNc7a6s7qLwVIe24; uin=o1966209546; _qpsvr_localtk=0.18626680745801882; xm_oidb_sid=1966209546&bb9e9bdc6d6ef603e3b715db4aec91c7");

    const sid = wedrive_sid[0].replace("wedrive_sid=", "");
    const requrl = `https://doc.weixin.qq.com/txdoc/imgupload?wedoc_xsrf=1&sid=${sid}`;
    const response = await fetch(requrl, {
      method: 'POST',
      headers: myHeaders,
      body: request.body,
      redirect: 'follow'
    });
    const newresult = await response.text();
    // console.log('newresult :>> ', newresult);
    // return newresult;
    // return new Response("ok")
    return new Response(newresult, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': '*',
        'Access-Control-Allow-Methods': '*',
        'Access-Control-Max-Age': '86400',
      },
    })

  }
  else {
    return new Response(null, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': '*',
        'Access-Control-Allow-Methods': '*',
        'Access-Control-Max-Age': '86400',
      },
    })
  }


}
