import powerbi from "powerbi-visuals-api";

import DataView = powerbi.DataView;
import VisualConstructorOptions = powerbi.extensibility.visual.VisualConstructorOptions;
import VisualUpdateOptions = powerbi.extensibility.visual.VisualUpdateOptions;
import IVisual = powerbi.extensibility.visual.IVisual;
import * as React from "react";
import * as ReactDOM from "react-dom";
import { ChatTranscript, initialState } from "./components/chatTranscript";

import "./../style/visual.less";

export class Visual implements IVisual {
    private target: HTMLElement;
    private reactRoot: React.ComponentElement<any, any>;
    private locale: string;

    constructor(options: VisualConstructorOptions) {
        this.reactRoot = React.createElement(ChatTranscript, {});
        this.target = options.element;
        this.locale = options.host.locale;

        ReactDOM.render(this.reactRoot, this.target);
    }

    public update(options: VisualUpdateOptions) {
        if (options.dataViews && options.dataViews[0]) {
            const dataView: DataView = options.dataViews[0];

            ChatTranscript.update({
                locale: this.locale,
                textLabel: dataView.metadata.columns[0].displayName,
                textValue: dataView.single.value.toString(),
            });
        } else {
            this.clear();
        }

    }

    private clear() {
        ChatTranscript.update(initialState);
    }
}