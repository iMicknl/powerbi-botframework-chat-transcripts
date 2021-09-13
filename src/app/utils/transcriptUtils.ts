import { ActivityTypes, IActivity, IMessageActivity, RoleTypes } from "botframework-schema";

/**
 * Returns list of activities from raw JSON input
 */
export const convertTextToActivities = (textValue: string): IActivity[] => {

    if (typeof(textValue) != "string") {
        throw new Error("Input is not a string value.");
    }
        
    try {
        return <IActivity[]>JSON.parse(textValue).activities;
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

    // Change role of the entity behind the account to a valid value.
    for (let activity of activities) {

        // 0 - activity is coming from bot
        if (activity?.from.role == "0") {
            activity.from.role = RoleTypes.Bot;
        }

        // 1 - activity is coming from the user interacting with the bot
        if (activity?.from.role == "1") {
            activity.from.role = RoleTypes.User;
        }

    }

    return activities;
};

/**
 * When Omnichannel for Customer Service (Dynamics 365) is bridging the messages
 * it will duplicate the text content as attachment
 */
 export const cleanOmnichannelActivities = (activities: IActivity[]): IActivity[] => {

    for (let activity of activities) {

        // Only clean message activities on the lcw channel
        if (activity.channelId === "lcw" && activity.type === ActivityTypes.Message) {
            const message = <IMessageActivity>activity;

            // Remove attachment, when it is a duplicate of the message
            if (message.text === message?.attachments[0].content) {
                delete(message?.attachments[0])
            }

        } 

    }

    return activities;
};



// "text": "Praat met een voorlichter", "attachments": [{ "contentType": "text/html", "content": "Praat met een voorlichter" }],