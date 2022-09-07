import View from "./View";

export default class ViewLoader
{
    onLoad: (view: View) => any;
    onError: (url: string) => any;

    private currentUrl: string;
    private cache: { [url: string]: View } = {};
    private pendingUrls: { [url: string]: true } = {};

    load(url: string)
    {
        // Stop if we are already working with this url
        if (url === this.currentUrl)
            return;

        // Try to immediately load from cache
        if (url in this.cache)
        {
            let cached = this.cache[url];
            cached === null ? this.onError(url) : this.onLoad(cached);
            return;
        }

        // Setting the url we are working on now
        this.currentUrl = url;

        // This url was added earlier and is already handling
        if (this.pendingUrls[url])
            return;

        //
        // No way but to load and parse data
        //

        this.pendingUrls[url] = true;

        let action: () => any;

        fetch(url)
            .then(response => response.json())
            .then((viewData: View) =>
            {
                if (!View.isValid(viewData))
                {
                    this.cache[url] = null;
                    throw new Error();
                }

                let view = new View;
                    view.url = url;
                    view.source = viewData.source;
                    view.content = viewData.content;

                this.cache[url] = view;

                action = () => this.onLoad(view);
            })
            .catch(() =>
            {
                this.cache[url] = null;
                action = () => this.onError(url);
            })
            .finally(() =>
            {
                delete this.pendingUrls[url];

                // Performing action if it is still needed
                if (url === this.currentUrl)
                {
                    action();
                    this.currentUrl = null;
                }
            });
    }
}