import Location from "src/entity/location/global";
import Layout from "src/frontend/Layout";
import { InlinerView, InlinerViewFactory } from "src/translator/view";
import { LinkRouter } from "./global";
import Link from "./inliner";

export class VLink extends InlinerView
{
    label: string;
    target: string;
    preview: string;
}

export class VFLink extends InlinerViewFactory<VLink, Link>
{
    async setupView(raw: Link): Promise<VLink>
    {
        let view = new VLink;
            view.label = await this.renderer.renderInliners(raw.label);

            let contextLocation = new Location;
                contextLocation.type = this.renderer.location.type;
                contextLocation.id = this.renderer.location.id;

            let linkViewData = await LinkRouter.getViewData(raw.target, contextLocation);

            view.target = linkViewData?.href;
            view.preview = linkViewData?.preview;

        return view;
    }

    async getRender(view: VLink): Promise<string>
    {
        return Layout.renderFile('inliner/link.pug', view);
    }
}