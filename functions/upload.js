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
    if (request.method == 'POST') {
        const response = await fetch('https://telegra.ph/' + url.pathname + url.search, {
            method: request.method,
            headers: request.headers,
            body: request.body,
        });
        const newresult = await response.text();
        console.log('newresult :>> ', newresult);
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
