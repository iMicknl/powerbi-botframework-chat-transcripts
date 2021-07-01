import React, { useState } from 'react';
import ReactWebChat, { createStore, StyleOptions } from 'botframework-webchat';
import { ActivityTypes } from "botframework-schema";

import { convertTextToActivities, cleanPowerVirtualAgentsActivities } from '.././utils/transcriptUtils'
import { VisualSettings } from '../../settings';

export interface ChatTranscriptVisualProps {
    locale: string;
    activities: string;
    settings: VisualSettings;
}

export const ChatTranscriptVisual = (props: ChatTranscriptVisualProps): JSX.Element => {

    // TODO useState + useEffect or this?
    const textValue = props.activities;
    const locale = props.locale;
    let activities = null;

    try {
        activities = convertTextToActivities(textValue);
    } catch (error) {
        return <>Transcript cannot be loaded. {error.toString()}</>;
    }

    if (!activities || activities.length < 1) {
        return <>Transcript cannot be loaded. No activities.</>;
    }

    // Fix roles in PVA context
    activities = cleanPowerVirtualAgentsActivities(activities);

    // Remove trace activity 
    // TODO fix array filter
    // activities = activities.filter(activity => activity.type != ActivityTypes.Trace);

    const activityMiddleware = () => next => ({ activity, nextVisibleActivity, ...otherArgs }) => {
        const { name, type } = activity;

        // Ignore trace activity 
        if (type === ActivityTypes.Trace) {
            return false;
        } else {
            return next({ activity, nextVisibleActivity, ...otherArgs });
        }
    };

    const store = createStore({ activities }, ({ dispatch }) => next => action => {
        return next(action);
    });

    const defaultStyleOptions: StyleOptions = {
        backgroundColor: "none", // Use background color set by Power BI
        hideSendBox: true,
        hideToaster: true // TODO Remove when https://github.com/iMicknl/powerbi-botframework-chat-transcripts/issues/9 is resolved.
    }

    const userStyleOptions: StyleOptions = {
        bubbleBackground: props.settings.styleOptions.bubbleBackground,
        bubbleFromUserBackground: props.settings.styleOptions.bubbleFromUserBackground,
        bubbleTextColor: props.settings.styleOptions.bubbleTextColor,
        bubbleFromUserTextColor: props.settings.styleOptions.bubbleFromUserTextColor,

        accent: props.settings.styleOptions.accent,
        subtle: props.settings.styleOptions.subtle,
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
                directLine={{}} // TODO https://github.com/iMicknl/powerbi-botframework-chat-transcripts/issues/9
                disabled={true}
                store={store}
                activityMiddleware={activityMiddleware}
                styleOptions={{ ...defaultStyleOptions, ...userStyleOptions }}
                locale={locale}
            />;
        </div>
    );
};
