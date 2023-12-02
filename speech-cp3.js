import * as sdk from 'microsoft-cognitiveservices-speech-sdk';
import dotenv from 'dotenv';

dotenv.config();

const audioFile = 'tonic-one-cp3.wav';

// This example requires environment variables named "SPEECH_KEY" and "SPEECH_REGION"
const speechConfig = sdk.SpeechConfig.fromSubscription(process.env.SPEECH_KEY, process.env.SPEECH_REGION);
const audioConfig = sdk.AudioConfig.fromAudioFileOutput(audioFile);

// The language of the voice that speaks.
speechConfig.speechSynthesisLanguage = "en-US"; 
speechConfig.speechSynthesisVoiceName = 'en-US-AriaNeural';
speechConfig.speechSynthesisOutputFormat = sdk.SpeechSynthesisOutputFormat.Riff24Khz16BitMonoPcm;

// Create the speech synthesizer.
var synthesizer = new sdk.SpeechSynthesizer(speechConfig, audioConfig);

const text = `
We're Superb Tonic One team! Now, let's jump into checkpoint 3 of our final presentation.

Tonic UI is the essential UI component library for the Trend Micro Vision One platform. As an open-source project supported by Trend Micro, it's accessible to developers worldwide, enabling them to utilize this UI component library for creating beautiful user interfaces.

Facing the reality, conventional search is inadequate to meet diverse today's user needs.

But fear not! Tonic one steps into rescue Tonic UI development.

Tonic One covers a wide range of Tonic UI components and featured examples. It can significant enhance developer experience with versatile support in various scenarios:
- Instance Guidance for problem solving
- Effortless code generation
- Interactive mentoring for frontend development  "

Now, it's demo time!


During the demo, we showcase two scenarios:
1. Real-time Guidance: Enhance the power of searching for any components or keywords to get real-time guidance on how to use them.
2. AI-powered enhancements: Paste your code and get AI-powered suggestions to improve your code just like a copilot."

However, the real challenge lies in prompt engineering. How can you create a prompt that accurately transforms your design or thought into code?

In the demo, we presented an example of "Showcasing a table scrollbar with 100 rows of data.". How can we enhance the result for a better outcome?

Now, utilize GPT-4 Vision to analyze your UI prototype. Ask GPT-4 Vision to act as a UI designer and provide a basic structure for the UI.

Next, extract the structure from the markdown and input it into the prompt. Let Tonic One assist in generating the desired outcome.

You can open the generated outcome in CodeSandbox

There are three key features in Tonic One: code suggestions, on-the-fly documentation insights, and interactive mentorship interface.
It can not only increase development time efficiencies through AI-powered support, but also enhance the overall development experience.

So, what's next? It's from design to code.
Imagine a future where developers can input a simple UI design prototype and generate the corresponding code utilizing the Tonic UI component library or other alternatives.
By combining GPT-4 Vision, Figma Design, and Tonic One, it will be a powerful trio that unlocks the potential to effortlessly translate design ideas into functional Tonic UI sample applications.

Tonic One is a comprehensive AI mentor, enabling developers to boost their work.
Lets embrace the future of front-end development.
Tonic One - Where AI Meets UI.
`.trim();

synthesizer.speakTextAsync(text, (result) => {
  if (result.reason === sdk.ResultReason.SynthesizingAudioCompleted) {
    console.log("synthesis finished.");
  } else {
    console.error("Speech synthesis canceled, " + result.errorDetails +
        "\nDid you set the speech resource key and region values?");
  }
  synthesizer.close();
  synthesizer = null;
  console.log("Now synthesizing to: " + audioFile);

}, (err) => {
  console.trace("err - " + err);
  synthesizer.close();
  synthesizer = null;
});
