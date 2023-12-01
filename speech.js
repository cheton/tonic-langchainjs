import * as sdk from 'microsoft-cognitiveservices-speech-sdk';
import dotenv from 'dotenv';

dotenv.config();

const audioFile = 'tonic-one-ai-companion.wav';

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
Welcome to the world of frontend development, where UI libraries hold the key to create stunning user interfaces. However, it is a bumpy ride: there are tons of documents and code examples to slow us down. It could be a lonely ride too, finding time to work with our mentors and peers to brainstorm solutions. Fear not, we can revolutionize how we work with UI libraries.
Introducing Tonic One, your AI Companion, with instant guidance and AI-powered enhancements to take your code to the next level.
Tonic One – Bridging the realms where AI meets UI.
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
