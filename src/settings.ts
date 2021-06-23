import { dataViewObjectsParser } from "powerbi-visuals-utils-dataviewutils";
import DataViewObjectsParser = dataViewObjectsParser.DataViewObjectsParser;

export class StyleOptionsSettings {
    public bubbleBackground: string = "white";
    public fontSize: number = 2;
}

export class VisualSettings extends DataViewObjectsParser {
    public styleOptions: StyleOptionsSettings = new StyleOptionsSettings();
}