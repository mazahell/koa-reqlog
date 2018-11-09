'use strict';

const assert = require('assert');
const Koa = require('koa');
const http = require('http');
const koaBodyParser = require('koa-bodyparser');
const request = require('supertest');
const should = require('should');
const Router = require('koa-router');
const reqLogger = require('../index');

describe('koa-reqlog', () => {
  let router;
  let app;

  beforeEach((done) => {
    app = new Koa();
    router = Router()
      .get('/test-route', (ctx, next) => {
        ctx.status = 200;
        ctx.body = { response: ['value1', 'value2'] };
      });
    done();
  });
  it('logger has requestId', (done) => {
    app.use(koaBodyParser({ enableTypes: ['json'] }));
    app.use(reqLogger({ url: '/request-log', lastItems: 20 }));
    app.use(router.routes());

    const srv = http.createServer(app.callback());
    request(srv)
      .get('/test-route')
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        res.type.should.equal('application/json');
        const requestId = res.header['x-request-id'];
        request(srv)
          .get('/request-log')
          .expect(200)
          .end((err, res) =>{
            if (err) return done(err);
            res.text.should.containEql(requestId);
            done();
          })
      });
  });
});