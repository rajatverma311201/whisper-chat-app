import React from "react";
import useSpeechRecognition from "@/hooks/util/use-speech-recognition";
import { Button } from "./ui/button";

const SpeechComponent = () => {
	const {
		isListening,
		transcript,
		startListening,
		stopListening,
		resetTranscript,
	} = useSpeechRecognition();

	return (
		<div>
			<Button onClick={startListening}>Start</Button>
			<Button onClick={stopListening}>Stop</Button>
			<Button onClick={resetTranscript}>Reset</Button>
			<p>{isListening ? "Listening..." : "Click start to speak"}</p>
			<p>Transcript: {transcript}</p>
		</div>
	);
};

export default SpeechComponent;
