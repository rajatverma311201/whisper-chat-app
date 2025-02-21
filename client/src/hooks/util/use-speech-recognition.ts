import { useState, useEffect, useRef } from "react";

const useSpeechRecognition = ({
	lang = "en-US",
	continuous = true,
	interimResults = false,
} = {}) => {
	const [isListening, setIsListening] = useState(false);
	const [transcript, setTranscript] = useState("");
	const [error, setError] = useState<string | null>(null);
	const recognitionRef = useRef(null);

	useEffect(() => {
		if (
			!(
				"webkitSpeechRecognition" in window ||
				"SpeechRecognition" in window
			)
		) {
			setError("Speech recognition is not supported in this browser.");
			return;
		}
		const SpeechRecognition =
			window.SpeechRecognition || window.webkitSpeechRecognition;
		recognitionRef.current = new SpeechRecognition();
		recognitionRef.current.lang = lang;
		recognitionRef.current.continuous = continuous;
		recognitionRef.current.interimResults = interimResults;

		recognitionRef.current.onstart = () => setIsListening(true);
		recognitionRef.current.onend = () => setIsListening(false);
		recognitionRef.current.onerror = (event) => setError(event.error);

		recognitionRef.current.onresult = (event) => {
			let finalTranscript = "";
			for (let i = 0; i < event.results.length; i++) {
				finalTranscript += event.results[i][0].transcript;
			}
			setTranscript(finalTranscript);
		};

		return () => {
			recognitionRef.current.abort();
		};
	}, [lang, continuous, interimResults]);

	const startListening = () => {
		if (recognitionRef.current) {
			setError(null);
			recognitionRef.current.start();
		}
	};

	const stopListening = () => {
		if (recognitionRef.current) {
			recognitionRef.current.stop();
		}
	};

	const resetTranscript = () => {
		setTranscript("");
	};

	return {
		isListening,
		transcript,
		error,
		startListening,
		stopListening,
		resetTranscript,
	};
};

export default useSpeechRecognition;
