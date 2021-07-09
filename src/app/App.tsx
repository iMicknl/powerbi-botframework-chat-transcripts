import powerbi from "powerbi-visuals-api";
import React, { useEffect, useState } from 'react';
import VisualConstructorOptions = powerbi.extensibility.visual.VisualConstructorOptions;
import VisualUpdateOptions = powerbi.extensibility.visual.VisualUpdateOptions;
import DataView = powerbi.DataView;
import IVisualEventService = powerbi.extensibility.IVisualEventService;

import { ChatTranscriptVisual } from './views/ChatTranscriptVisual';
import { VisualSettings } from "../settings";

export interface AppProps {
    constructorOptions: VisualConstructorOptions;
    visualUpdateOptions?: VisualUpdateOptions;
}

const App = (props: AppProps): JSX.Element => {

    const [locale, setLocale] = useState("en-us");
    const [dataView, setDataView] = useState<DataView>(null);
    const [settings, setSettings] = useState<VisualSettings>(null);
    const [eventService, setEventService] = useState<IVisualEventService>(null);

    useEffect(() => {
        setLocale(props.constructorOptions.host.locale);
    }, [props.constructorOptions])

    useEffect(() => {
        if (props.visualUpdateOptions?.dataViews.length > 0) {
            setDataView(props.visualUpdateOptions.dataViews[0]);
        }
    }, [props.visualUpdateOptions])

    useEffect(() => {
        setEventService(props.constructorOptions.host.eventService);
    }, [props.constructorOptions])

    useEffect(() => {
        setSettings(VisualSettings.parse<VisualSettings>(dataView))
    }, [dataView])

    // Visual has data
    if (dataView?.single) {
        return (
            <ChatTranscriptVisual locale={locale} activities={dataView.single.value.toString()} settings={settings} />
        );
    } else {
        return <>Add your Chat Activities (JSON) to start using this visual.</>;
    }

};

export default App;
