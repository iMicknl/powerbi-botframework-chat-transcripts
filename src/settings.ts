import { dataViewObjectsParser } from "powerbi-visuals-utils-dataviewutils";
import DataViewObjectsParser = dataViewObjectsParser.DataViewObjectsParser;

export class StyleOptionsSettings {
    public accent: string = "#0063B1";
    public subtle: string = "#767676";
    public bubbleBackground: string = "white";
    public bubbleTextColor: string = "black";
}

export class VisualSettings extends DataViewObjectsParser {
    public styleOptions: StyleOptionsSettings = new StyleOptionsSettings();
}
