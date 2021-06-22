![screenshot of Power BI Custom Visual](https://github.com/iMicknl/powerbi-botframework-chat-transcripts/blob/main/media/powerbi-custom-visual.png?raw=true)

# Chat Transcripts for Bot Framework - Custom Visual

This custom visual for Power BI  visualises bot transcripts (activities) to show the interactions between a user and your bot in a webchat. Add transcript logging to your Power BI (Embedded) scenarios!

In order to use this custom visual, you will need to have your activities (array) in JSON format and compliant to the [Bot Framework Activity schema](https://github.com/microsoft/botframework-sdk/blob/main/specs/botframework-activity/botframework-activity.md#message-activity). This is the default format for [Power Virtual Agents transcripts, saved in Dataverse](https://docs.microsoft.com/en-us/power-virtual-agents/analytics-sessions-transcripts).

## Features

- Visualize Bot Framework (transcript) activities
- Visualize Power Virtual Agents activities
- Web Chat language based on Power BI language

## How to use

Power BI visuals are packaged as a single .pbiviz file, that can then be imported into a Power BI report. Head to [releases](https://github.com/iMicknl/powerbi-botframework-chat-transcripts/releases) and download the .pbiviz file of the last available version.

To import a Power BI visual from a file, see [Import a visual file from your local computer into Power BI](https://docs.microsoft.com/en-us/power-bi/developer/visuals/import-visual#import-a-visual-file-from-your-local-computer-into-power-bi).


## How to contribute to the development

This project is based on [PowerBI Visual Tools (pbiviz)](https://github.com/microsoft/PowerBI-visuals-tools#powerbi-visual-tools-pbiviz). 

### Start development server

```npm run start```

### Package for production

```npm run package```

## License

MIT