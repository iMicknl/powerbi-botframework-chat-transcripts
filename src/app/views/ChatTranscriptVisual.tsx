import React, { useState } from 'react';
import ReactWebChat, { createStore } from 'botframework-webchat';

export interface ChatTranscriptVisualProps {
    locale: string;
    activities: string
}

export const ChatTranscriptVisual = (props: ChatTranscriptVisualProps): JSX.Element => {
    // const [textValue, setTextValue] = useState("");
    const textValue = props.activities;
    const locale = props.locale;

    let activities: any = []
    let history: any = null

    try {
        history = JSON.parse(textValue)
    } catch (error) {
        console.warn("Oh oh, JSON error!");
        console.error(error);
        console.warn(textValue);
    }

    if (history) {
        activities = history.activities;
        console.log(activities);
    }

    const store = createStore({ activities }, ({ dispatch }) => next => action => {
        return next(action);
    });

    // Remove trace activity 
    // TODO fix array filter
    activities = activities.filter(activity => activity.type != "trace");

    // Fix roles in PVA context
    if (activities) {
        for (let activity of activities) {
            if (activity?.from?.role == 0) {
                activity.from.role = "bot";
            }
            if (activity?.from?.role == 1) {
                activity.from.role = "user";
            }
        }

        console.log(activities);
    }

    const activityMiddleware = () => next => ({ activity, nextVisibleActivity, ...otherArgs }) => {
        const { name, type } = activity;

        // Ignore trace activity 
        if (type === 'trace') {
            console.log(activity)
            return false;
        } else {
            return next({ activity, nextVisibleActivity, ...otherArgs });
        }
    };

    const styleOptions = {
        hideUploadButton: true,
        hideSendBox: true,
        hideToaster: true // TODO remove when javascripterror is gone (blocked by: directLine connection)
    }

    return (
        <div id="webchat" className="webchatCard">
            <ReactWebChat
                directLine={{}} // TODO figure out how to disable connections entirely
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