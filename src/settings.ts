import { dataViewObjectsParser } from "powerbi-visuals-utils-dataviewutils";
import DataViewObjectsParser = dataViewObjectsParser.DataViewObjectsParser;
import { StyleOptions } from 'botframework-webchat';

export class StyleOptionsSettings {
    public accent: string = "#0063B1";
    public subtle: string = "#767676";
    public bubbleBackground: string = "white";
    public bubbleTextColor: string = "black";
    public bubbleFromUserBackground: string = "white";
    public bubbleFromUserTextColor: string = "black";
    public timestampFormat: StyleOptions["timestampFormat"] = "absolute"
}

export class AvatarSettings {
    public show: boolean = true;
    public botAvatarInitials: string = "Bot";
    public botAvatarImage: string = "";
    public userAvatarInitials: string = "User";
    public userAvatarImage: string = "";
}

export class VisualSettings extends DataViewObjectsParser {
    public styleOptions: StyleOptionsSettings = new StyleOptionsSettings();
    public avatarSettings: AvatarSettings = new AvatarSettings();
}
