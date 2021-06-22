import powerbi from "powerbi-visuals-api";

import DataView = powerbi.DataView;
import VisualConstructorOptions = powerbi.extensibility.visual.VisualConstructorOptions;
import VisualUpdateOptions = powerbi.extensibility.visual.VisualUpdateOptions;
import IVisual = powerbi.extensibility.visual.IVisual;
import * as React from "react";
import * as ReactDOM from "react-dom";

import App from "./app/App";

import "./../style/visual.less";

export class Visual implements IVisual {
    private target: HTMLElement;
    private constructorOptions: VisualConstructorOptions;

    constructor(options: VisualConstructorOptions) {
        this.target = options.element;
        this.constructorOptions = options;
        this.renderComponent(React.createElement(App, { constructorOptions: options }))
    }

    public update(options: VisualUpdateOptions) {
        // TODO figure out how to do this without rerender, just update the props / state
        // https://docs.microsoft.com/en-us/power-bi/developer/visuals/performance-tips#cache-dom-nodes
        this.renderComponent(React.createElement(App, { constructorOptions: this.constructorOptions, visualUpdateOptions: options }))
    }

    private renderComponent(component) {
        ReactDOM.render(component, this.target);
    }

    private clear() {
        ReactDOM.unmountComponentAtNode(this.target);
    }
}