const SidebarCompponent = {
  oninit(vnode) {
    this.requests = vnode.attrs.requests;
    this.changeIdx = vnode.attrs.changeIdx;
    this.q = '';
  },
  filter(e) {
    this.q = e.target.value;
  },
  selectIdx(idx) {
    m.route.param('idx', idx);
    m.route.set(`/${idx}`);
  },
  view() {
    const { q } = this;
    const filtered = this.requests.filter(i => {
      if (q.length) {
        return i.requestId.indexOf(q) >= 0;
      }
      return true;
    });
    /* eslint-disable */
    const requestList = filtered.map(item => m(`li[m-type="${item.method}"]`, { onclick: () => this.selectIdx(item.requestId) }, [
      m('span.list-requests-ids__info-block', item.method),
      m('', item.requestId)
    ]));
    /* eslint-enable */

    return m('aside.column.column-20', [
      m('input.search[type="text"][placeholder="Search request"]', { onkeyup: e => this.filter(e) }),
      m('ol.list-requests-ids', requestList)
    ]);
  }
};

module.exports = SidebarCompponent;
