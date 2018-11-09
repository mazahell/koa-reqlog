const map = require('lodash.map');
const find = require('lodash.find');

const PreviewComponent = {
  oninit() {
    this.headersIsOpened = false;
    this.requestHeadersIsOpened = false;
  },
  showHide(param, e) {
    e.stopPropagation();
    this[param] = !this[param];
  },
  view(vnode) {
    const obj = find(vnode.attrs.requests, { requestId: m.route.param('idx') });
    if (!obj) {
      return m('main.column.column-80', [
        m('h2', 'No selected request')
      ]);
    }
    const {
      header,requestHeaders, requestId, requestedAt, path, body, query, response, method, statusCode
    } = obj;

    return m('main.column.column-80', [
      m('h2', [
        m('span[style="font-weight: bold"]', `Request: ${requestId} (${statusCode})`),
        m('span.date', requestedAt)
      ]),
      m('div.request-uri', { 'm-type': method }, [
        m('.method', { 'm-type': method }, method),
        m('.uri', { 'm-type': method }, path)
      ]),
      m('.data-container', { class: Object.keys(query).length ? '' : 'hidden' }, [
        m('h4', 'Query Params'),
        map(query, (v, i) => [
          m('.key-value', [
            m('.column.column-20', i),
            m('.column.column-80.columnNoWrap', { title: v }, v)
          ])
        ])
      ]),
      m('.data-container', { class: Object.keys(response).length ? '' : 'hidden' }, [
        m('h4', 'Response Body'),
        m('.key-value', [
          m('pre', JSON.stringify(response, null, 2))
        ])
      ]),
      m('.data-container', { class: Object.keys(body).length ? '' : 'hidden' }, [
        m('h4', 'Request Body'),
        m('.key-value', [
          m('pre', JSON.stringify(body, null, 2))
        ])
      ]),
      m('.data-container', [
        m('h4.pointer', { onclick: e => this.showHide('headersIsOpened', e) }, 'Response Headers'),
        m('.data', { class: this.headersIsOpened ? '' : 'hidden' },
          map(header, (v, i) => [
            m('.key-value', [
              m('.column.column-20', i),
              m('.column.column-80.columnNoWrap', { title: v }, v)
            ])
          ]))
      ]),
      m('.data-container', [
        m('h4.pointer', { onclick: e => this.showHide('requestHeadersIsOpened', e) }, 'Request Headers'),
        m('.data', { class: this.requestHeadersIsOpened ? '' : 'hidden' },
          map(requestHeaders, (v, i) => [
            m('.key-value', [
              m('.column.column-20', i),
              m('.column.column-80.columnNoWrap', { title: v }, v)
            ])
          ]))
      ])
    ]);
  }
};

module.exports = PreviewComponent;
