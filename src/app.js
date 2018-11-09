const PreviewComponent = require('./components/PreviewComponent');
const SidebarComponent = require('./components/SidebarComponent');

const RootPage = {
  oninit() {
    this.requests = window.requests;
    this.idx = '';
  },
  view() {
    const { requests } = this;
    return m('.row', [
      m(SidebarComponent, { requests }),
      m(PreviewComponent, { requests })
    ]);
  }
};

m.route(document.getElementById('app'), '/main', {
  '/:idx': RootPage
});
