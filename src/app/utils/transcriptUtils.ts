import { ActivityTypes, Channels, IActivity, IMessageActivity, RoleTypes } from "botframework-schema";

/**
 * Returns list of activities from raw JSON input
 */
export const convertTextToActivities = (textValue: string): IActivity[] => {

    if (typeof textValue != "string") {
        throw new Error("Input is not a string value.");
    }
    
    // Parse text to JSON
    let json;
    try {
       json = JSON.parse(textValue)
    } catch (error) {
        if (textValue.length == 32766) {
            console.error(error);
            throw new Error("JSON invalid. This chat conversation most likely exceeds the 32766 character limit per field in Power BI.");
        }
        console.error(error);
        throw new Error("JSON invalid.");
    }

    // Cast JSON object to Bot Framework Activities
    try {
        return <IActivity[]>json.activities;
    } catch (error) {
        console.error(error);
        throw new Error("JSON does not contain valid activities.");
    }

};

/**
 * Since 4.15.3 (https://github.com/microsoft/BotFramework-WebChat/releases/tag/v4.15.3) a field webchat:send-status is required.
 * This function will add these values to the channelData property.
 */
export const addSendStatusToChannelData = (activities: IActivity[]): IActivity[] => {

    for (const activity of activities) {
        activity["channelData"] = activity["channelData"] || {}
        activity.channelData["webchat:send-status"] = "sent";
    }

    return activities;
};

/**
 * Adaptive Cards can pass the user response via the `value` property of the `MessageActivity`, which
 * will render as an empty message. This function will show these values as a string in the transcript.
 */
 export const cleanAdaptiveCardActivities = (activities: IActivity[]): IActivity[] => {

    for (const activity of activities) {
        if (activity.type === ActivityTypes.Message) {
            const message = <IMessageActivity>activity;

            if (message.value && !message.text) {
                if (message?.attachments[0]?.content == "") {
                    message.attachments[0].content = "User responded: " + JSON.stringify(message.value);
                }
            }
        }
    }

    return activities;
};

/**
 * Power Virtual Agents activities are not compliant to the Bot Framework Activity schema
 * https://docs.microsoft.com/en-us/power-virtual-agents/analytics-sessions-transcripts#content-field
 */
export const cleanPowerVirtualAgentsActivities = (activities: IActivity[]): IActivity[] => {

    // Change role of the entity behind the account to a valid value.
    for (const activity of activities) {

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

    for (const activity of activities) {
        // Only clean message activities on the lcw channel
        if (activity.channelId === "lcw" && activity.type === ActivityTypes.Message) {
            const message = <IMessageActivity>activity;

            // Remove attachment, when it is a duplicate of the message
            if (message.text === message?.attachments[0]?.content) {
                delete message?.attachments[0];
            }
        }
    }

    return activities;
};

/**
 * Messages on the Teams channel can contain the text in textFormat 'plain',
 * with the same text content duplicated as attachment inside <p> HTML tags
 */
 export const cleanTeamsActivities = (activities: IActivity[]): IActivity[] => {

    for (const activity of activities) {
        // Only clean message activities on the MSTeams channel
        if (activity.channelId === Channels.Msteams && activity.type === ActivityTypes.Message) {
            const message = <IMessageActivity>activity;

            // Remove attachment, when it is a duplicate of the original message
            if (message?.attachments[0]?.contentType == "text/html" && message?.attachments[0]?.content.includes(message.text)) {
                delete(message?.attachments[0])
            }
        }
    }

    return activities;
};
