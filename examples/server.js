const Koa = require('koa');
const koaJson = require('koa-json');
const koaBodyParser = require('koa-bodyparser');
const requestLogger = require('../index.js')

const app = new Koa();

app.use(koaJson({pretty: false}));
app.use(koaBodyParser({ enableTypes: ['json'] }));
app.use(requestLogger({ lastItems: 20, url: '/request-log' }));

app.listen(process.env.PORT || 3000);