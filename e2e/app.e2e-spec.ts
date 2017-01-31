import { VirtualQuizPage } from './app.po';

describe('virtual-quiz App', function() {
  let page: VirtualQuizPage;

  beforeEach(() => {
    page = new VirtualQuizPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
