import powerbi from "powerbi-visuals-api";

import VisualConstructorOptions = powerbi.extensibility.visual.VisualConstructorOptions;
import VisualUpdateOptions = powerbi.extensibility.visual.VisualUpdateOptions;
import IVisual = powerbi.extensibility.visual.IVisual;

import VisualObjectInstance = powerbi.VisualObjectInstance;
import EnumerateVisualObjectInstancesOptions = powerbi.EnumerateVisualObjectInstancesOptions;
import VisualObjectInstanceEnumerationObject = powerbi.VisualObjectInstanceEnumerationObject;

import * as React from "react";
import * as ReactDOM from "react-dom";

import App from "./app/App";
import { VisualSettings } from "./settings";



import "./../style/visual.less";

export class Visual implements IVisual {
    private target: HTMLElement;
    private constructorOptions: VisualConstructorOptions;
    private settings: VisualSettings;

    constructor(options: VisualConstructorOptions) {
        this.target = options.element;
        this.constructorOptions = options;
        this.renderComponent(React.createElement(App, { constructorOptions: options }))
    }

    public enumerateObjectInstances(
        options: EnumerateVisualObjectInstancesOptions
    ): VisualObjectInstance[] | VisualObjectInstanceEnumerationObject {
        return VisualSettings.enumerateObjectInstances(this.settings || VisualSettings.getDefault(), options);
    }

    public update(options: VisualUpdateOptions) {
        this.renderComponent(React.createElement(App, { constructorOptions: this.constructorOptions, visualUpdateOptions: options }))

        // Persist visual settings
        if (options?.dataViews.length > 0) {
            this.settings = VisualSettings.parse(options.dataViews[0]);
        }
    }

    private renderComponent(component) {
        ReactDOM.render(component, this.target);
    }

    public destroy() {
        ReactDOM.unmountComponentAtNode(this.target);
    }

}
