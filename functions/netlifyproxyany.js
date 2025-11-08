// netlifyproxyany.js
export async function handler(event, context) {
  const { httpMethod, headers, body, queryStringParameters } = event;
  const proxyurl = queryStringParameters?.url;

  if (!proxyurl) {
    return {
      statusCode: 400,
      body: 'Missing url parameter',
      headers: {
        'Access-Control-Allow-Origin': '*',
      }
    };
  }

  if (httpMethod === 'POST') {
    let requestBody = null;
    try {
      requestBody = JSON.parse(body);
    } catch (e) {
      // body可能不是json，按文本传
      requestBody = body;
    }

    const fetchOptions = {
      method: 'POST',
      headers: headers,
      body: typeof requestBody === 'string' ? requestBody : JSON.stringify(requestBody),
      redirect: 'follow'
    };

    try {
      const response = await fetch(proxyurl, fetchOptions);
      const responseText = await response.text();

      return {
        statusCode: response.status,
        body: responseText,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': '*',
          'Access-Control-Allow-Methods': '*',
          'Access-Control-Max-Age': '86400',
        }
      };
    } catch (error) {
      return {
        statusCode: 500,
        body: `Error fetching: ${error.message}`,
        headers: {
          'Access-Control-Allow-Origin': '*',
        }
      };
    }

  } else if (httpMethod === 'GET') {
    try {
      const response = await fetch(proxyurl, {
        method: 'GET',
        headers: headers,
        redirect: 'follow',
      });

      // 这里为了简单起见直接返回响应体文本
      const text = await response.text();

      return {
        statusCode: response.status,
        body: text,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': '*',
          'Access-Control-Allow-Methods': '*',
          'Access-Control-Max-Age': '86400',
        }
      };
    } catch (error) {
      return {
        statusCode: 500,
        body: `Error fetching: ${error.message}`,
        headers: {
          'Access-Control-Allow-Origin': '*',
        }
      };
    }
  } else {
    return {
      statusCode: 405,
      body: 'Method Not Allowed',
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': '*',
        'Access-Control-Allow-Methods': '*',
      }
    };
  }
}
