import PreviewUI from "./PreviewUI";
import View from "./View";
import ViewLoader from "./ViewLoader";

export default class Preview
{
    ui: PreviewUI;
    loader: ViewLoader;
    viewStack: View[] = [];

    private loading: boolean;

    constructor()
    {
        // UI
        {
            this.ui = new PreviewUI;

            this.ui.onBackClick = () =>
            {
                let targetView;

                for (let i = 0; i < (this.loading ? 1 : 2); i++)
                    targetView = this.viewStack.pop();

                if (targetView)
                    this.showView(targetView);
            }

            this.ui.onCloseComplete = () =>
            {
                this.loading = false;
                this.viewStack = [];
            }
        }
        
        // View Loader
        {
            this.loader = new ViewLoader;

            let isResultNeeded = () => this.loading;

            this.loader.onLoad = (view) =>
            {
                if (!isResultNeeded())
                    return;

                this.showView(view);
            }

            this.loader.onError = () =>
            {
                if (!isResultNeeded())
                    return;

                this.showError();
            }
        }
    }

    exit()
    {
        this.ui.exit();
    }

    loadView(url: string)
    {
        this.showLoading();
        this.loader.load(url);
    }

    showView(view: View)
    {
        this.loading = false;

        if (this.viewStack.at(-1) != view)
            this.viewStack.push(view);

        this.ui.setViewScreen(view);
        this.ui.setButtons(this.canBack(), sameSource(view.source) ? null : view.source);
    }

    showLoading()
    {
        if (this.loading)
            return;

        this.loading = true;

        this.ui.setLoadingScreen();
        this.ui.setButtons(this.canBack(), null);
    }

    showError()
    {
        this.ui.setErrorScreen();
        this.ui.setButtons(this.canBack(), null);
    }

    private canBack()
    {
        let needLength = this.loading ? 1 : 2;
        return this.viewStack.length >= needLength;
    }
}

function sameSource(source: string)
{
    let url = new URL(source);

    let current = location.host + location.pathname;
    let target = url.host + url.pathname;

    return current === target;
}