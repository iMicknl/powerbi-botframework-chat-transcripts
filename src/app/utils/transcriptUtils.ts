import { IActivity } from "botframework-schema";


/**
 * Returns list of activities from raw JSON input
 */
export const convertTextToActivities = (textValue: string): IActivity[] => {

    if (typeof(textValue) != "string") {
        throw new Error("Input is not a string value.");
    }
        
    try {
        const activities: IActivity[] = JSON.parse(textValue).activities;
        return activities;
    } catch (error) {
        console.error(error);
        throw new Error("JSON invalid.");
    }

};

/**
 * Power Virtual Agents activities are not compliant to the Bot Framework Activity schema
 * https://docs.microsoft.com/en-us/power-virtual-agents/analytics-sessions-transcripts#content-field
 */
export const cleanPowerVirtualAgentsActivities = (activities: IActivity[]): IActivity[] => {

    // Remove trace activity 
    // TODO fix array filter
    // activities = activities.filter(activity => activity.type != "trace");

    // 
    for (let activity of activities) {

        // 0 - activity is coming from bot
        if (activity?.from?.role == "0") {
            activity.from.role = "bot";
        }

        // 1 - activity is coming from the user interacting with the bot
        if (activity?.from?.role == "1") {
            activity.from.role = "user";
        }

    }

    return activities;
};