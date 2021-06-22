import powerbi from "powerbi-visuals-api";
import React, { useEffect, useState } from 'react';
import VisualConstructorOptions = powerbi.extensibility.visual.VisualConstructorOptions;
import VisualUpdateOptions = powerbi.extensibility.visual.VisualUpdateOptions;
import DataView = powerbi.DataView;

import { ChatTranscriptVisual } from './views/ChatTranscriptVisual';

export interface AppProps {
    constructorOptions: VisualConstructorOptions;
    visualUpdateOptions?: VisualUpdateOptions;
}

const App = (props: AppProps): JSX.Element => {

    const [locale, setLocale] = useState("en-us");
    const [dataView, setDataView] = useState<DataView>(null);

    useEffect(() => {
        setLocale(props.constructorOptions.host.locale);
    }, [props.constructorOptions])
  
    useEffect(() => {
        if (props.visualUpdateOptions?.dataViews.length > 0) {
            setDataView(props.visualUpdateOptions.dataViews[0]);
        }
    }, [props.visualUpdateOptions])

    // Visual has data
    if (dataView?.single) {
        console.log(typeof(dataView.single.value))
        return (
            <ChatTranscriptVisual locale={locale} activities={dataView.single.value.toString()} />
        );
    } else {
        return <>Add your Chat Activities (JSON) to the visual to start.</>;
    }

};

export default App;