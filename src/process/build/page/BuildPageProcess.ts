import EruditProcess from "src/process/EruditProcess";
import Page from "src/page/Page";
import Layout from "src/frontend/Layout";

export default abstract class BuildPageProcess<TPageView extends Page> extends EruditProcess
{
    async preparePages(): Promise<TPageView | TPageView[]> { return; };
    abstract pageLabel: string;

    name = '[TODO] Process name';

    async do()
    {
        let pages: TPageView[] = [];

        let prepareResult = await this.preparePages();
        pages = Array.isArray(prepareResult) ? prepareResult : [prepareResult];

        if (pages.length === 0)
        {
            this.name = `Build ${this.pageLabel} pages`;
            return;
        }

        this.name = `Build ${this.pageLabel} page${pages.length > 1 ? 's': ''}`;

        pages.forEach(page => this.buildPage(page));
    }

    private buildPage(page: TPageView)
    {
        // Один общий метод compilePage (вдруг надо будет больше действий?)
        Layout.compileFile(`page/${page.layout}.pug`, page.getDest(), page);
    }
}