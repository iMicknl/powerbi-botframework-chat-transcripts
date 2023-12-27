import React from 'react';
import ReactWebChat, { createStore, StyleOptions } from 'botframework-webchat';
import { ActivityTypes, IActivity } from "botframework-schema";

import { addSendStatusToChannelData, convertTextToActivities, cleanPowerVirtualAgentsActivities, cleanOmnichannelActivities, cleanAdaptiveCardActivities } from '.././utils/transcriptUtils'
import { VisualSettings } from '../../settings';

import { OfflineHistoryConnection } from '../OfflineHistoryConnection'

import * as moment from 'moment'

export interface ChatTranscriptVisualProps {
    locale: string;
    activities: string;
    settings: VisualSettings;
}

export const ChatTranscriptVisual = (props: ChatTranscriptVisualProps): JSX.Element => {

    const textValue: string = props.activities;
    const locale: string = props.locale;
    let activities: IActivity[] | null = null;

    moment.locale(locale);

    try {
        activities = convertTextToActivities(textValue);
    } catch (error) {
        return <>Transcript cannot be loaded. {error.toString()}</>;
    }

    if (!activities || activities.length < 1) {
        return <>Transcript cannot be loaded. No activities.</>;
    }

    // Perform channel specific fixes
    try {
        activities = addSendStatusToChannelData(activities);
        activities = cleanPowerVirtualAgentsActivities(activities);
        activities = cleanOmnichannelActivities(activities);
        activities = cleanAdaptiveCardActivities(activities);
    } catch (error) {
        return <>Transcript cannot be loaded. Issue with transformation: {error.toString()}</>;
    }

    const activityMiddleware = () => next => ({ activity, nextVisibleActivity, ...otherArgs }) => {
        const { type } = activity;

        // Parse activity timestamp and convert from ISO string to human readable format
        if (activity.timestamp) {
            const timestamp = moment.unix(activity.timestamp)
            activity.timestamp = timestamp.format("LL LT");
        }

        // PVA: Render survey response (submit) as message
        if (type === ActivityTypes.Message && activity.value) {
            // tslint:disable-next-line
            for (const value in activity.value) {
                if (["1", "2", "3", "4", "5"].includes(activity.value[value])) {
                    activity.text = activity.value[value];
                    return next({ activity, nextVisibleActivity, ...otherArgs });
                }
            }
        }

        // Ignore trace activity 
        if (type === ActivityTypes.Trace) {
            return false;
        } else {
            return next({ activity, nextVisibleActivity, ...otherArgs });
        }
    };

    const store = createStore({ activities }, () => next => action => {
        return next(action);
    });

    const defaultStyleOptions: StyleOptions = {
        backgroundColor: "none", // Use background color set by Power BI
        hideSendBox: true,
    }

    const userStyleOptions: StyleOptions = {
        bubbleBackground: props.settings.styleOptions.bubbleBackground,
        bubbleFromUserBackground: props.settings.styleOptions.bubbleFromUserBackground,
        bubbleTextColor: props.settings.styleOptions.bubbleTextColor,
        bubbleFromUserTextColor: props.settings.styleOptions.bubbleFromUserTextColor,

        accent: props.settings.styleOptions.accent,
        subtle: props.settings.styleOptions.subtle,
        timestampFormat: props.settings.styleOptions.timestampFormat
    }

    if (props.settings.avatarSettings.show) {
        // User Avatar
        if (props.settings.avatarSettings.userAvatarImage) {
            userStyleOptions.userAvatarImage = props.settings.avatarSettings.userAvatarImage
            userStyleOptions.userAvatarInitials = "" // Empty string is required when setting userAvatarImage
        } else if (props.settings.avatarSettings.userAvatarInitials) {
            userStyleOptions.userAvatarInitials = props.settings.avatarSettings.userAvatarInitials
        }

        // Bot Avatar
        if (props.settings.avatarSettings.botAvatarImage) {
            userStyleOptions.botAvatarImage = props.settings.avatarSettings.botAvatarImage
            userStyleOptions.botAvatarInitials = "" // Empty string is required when setting botAvatarImage
        } else if (props.settings.avatarSettings.botAvatarInitials) {
            userStyleOptions.botAvatarInitials = props.settings.avatarSettings.botAvatarInitials
        }
    }

    return (
        <div id="webchat" className="webchatCard">
            <ReactWebChat
                directLine={new OfflineHistoryConnection()}
                disabled={true}
                store={store}
                activityMiddleware={activityMiddleware}
                styleOptions={{ ...defaultStyleOptions, ...userStyleOptions }}
                locale={locale}
            />;
        </div>
    );
};
