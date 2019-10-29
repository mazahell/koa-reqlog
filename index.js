const crypto = require('crypto');
const pug = require('pug');

const requests = [];

module.exports = ({ url = '/request-log', lastItems = 20, ignore = [] }) => async (ctx, next) => {
  const sameUrl = ctx.request.path.trim() === url.trim();
  const requestId = crypto.randomBytes(4).toString('hex');
  ctx.set('x-request-id', requestId);
  ctx.res.once('finish', () => {
    if (!sameUrl) {
      const { method, body } = ctx.request;
      const { body: responseBody } = ctx.response;
      const { _headers: header, statusCode } = ctx.res;
      const { headers: requestHeaders } = ctx.req;
      const { query, path } = ctx;
      requests.push({
        requestId,
        statusCode,
        method,
        path,
        query,
        header,
        requestHeaders,
        body,
        response: responseBody !== undefined ? responseBody : '',
        requestedAt: new Date()
      });
      requests.splice(0, requests.length - lastItems);
    }
  });

  if (sameUrl) {
    ctx.type = 'text/html';
    ctx.body = pug.renderFile(`${__dirname}/index.pug`, {
      title: 'Request-Logger v1.0.0',
      requests: JSON.stringify([...requests].reverse())
    });
  } else {
    await next();
  }
};
