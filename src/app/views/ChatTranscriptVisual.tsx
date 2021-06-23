import React, { useState } from 'react';
import ReactWebChat, { createStore } from 'botframework-webchat';
import { ActivityTypes } from "botframework-schema";

import { convertTextToActivities, cleanPowerVirtualAgentsActivities } from '.././utils/transcriptUtils'

export interface ChatTranscriptVisualProps {
    locale: string;
    activities: string
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
            console.log(activity)
            return false;
        } else {
            return next({ activity, nextVisibleActivity, ...otherArgs });
        }
    };

    const store = createStore({ activities }, ({ dispatch }) => next => action => {
        return next(action);
    });

    const styleOptions = {
        hideUploadButton: true,
        hideSendBox: true,
        hideToaster: true // TODO Remove when https://github.com/iMicknl/powerbi-botframework-chat-transcripts/issues/9 is resolved.
    }

    return (
        <div id="webchat" className="webchatCard">
            <ReactWebChat
                directLine={DirectLineMock} // TODO https://github.com/iMicknl/powerbi-botframework-chat-transcripts/issues/9
                userID="Power BI"
                disabled={true}
                store={store}
                activityMiddleware={activityMiddleware}
                styleOptions={styleOptions}
                locale={locale}
            />;
        </div>
    );
};



const DirectLineMock = () => {

    subscribe => {}

}