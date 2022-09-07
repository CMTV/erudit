import EruditProcess from "src/process/EruditProcess";
import Page from "src/page/Page";
import Layout from "src/frontend/Layout";

export default abstract class BuildPageProcess<TPageView extends Page> extends EruditProcess
{
    abstract preparePages(): TPageView | TPageView[];

    name = '[TODO] Process name';

    async do()
    {
        let pages: TPageView[] = [];

        let prepareResult = this.preparePages();
        pages = Array.isArray(prepareResult) ? prepareResult : [prepareResult];

        this.name = `Build ${pages[0].layout} page${pages.length > 1 ? 's': ''}`;

        pages.forEach(page => this.buildPage(page));
    }

    private buildPage(page: TPageView)
    {
        Layout.compile(`page/${page.layout}.pug`, page, page.getDest());
    }
}