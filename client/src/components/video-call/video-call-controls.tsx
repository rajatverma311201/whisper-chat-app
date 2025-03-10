"use client";

import { useState, useEffect, MutableRefObject } from "react";
import {
	Mic,
	MicOff,
	Video,
	VideoOff,
	Settings,
	PhoneOff,
	Users,
	MonitorSmartphone,
	MoreVertical,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { DeviceSelector } from "./device-selector";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useSocket } from "@/hooks/global/use-socket";
import { useRouter } from "next/navigation";

interface VideoCallControlsProps {
	room: string;
	mediaStreamRef: MutableRefObject<Nullable<MediaStream>>;
	peerConnectionRef: MutableRefObject<Nullable<RTCPeerConnection>>;
}
export const VideoCallControls: React.FC<VideoCallControlsProps> = ({
	room,
	mediaStreamRef,
	peerConnectionRef,
}) => {
	const [isMuted, setIsMuted] = useState(false);
	const [isVideoOn, setIsVideoOn] = useState(true);
	const [audioDevices, setAudioDevices] = useState<MediaDeviceInfo[]>([]);
	const [videoDevices, setVideoDevices] = useState<MediaDeviceInfo[]>([]);
	const [audioOutputDevices, setAudioOutputDevices] = useState<
		MediaDeviceInfo[]
	>([]);
	const [selectedAudioInput, setSelectedAudioInput] = useState<string>("");
	const [selectedVideoInput, setSelectedVideoInput] = useState<string>("");
	const [selectedAudioOutput, setSelectedAudioOutput] = useState<string>("");
	const [screenPresenting, setScreenPresenting] = useState(false);
	const { socket } = useSocket();
	const router = useRouter();

	useEffect(() => {
		const getDevices = async () => {
			try {
				const devices = await navigator.mediaDevices.enumerateDevices();
				const audioInputs = devices.filter(
					(device) => device.kind === "audioinput",
				);
				const videoInputs = devices.filter(
					(device) => device.kind === "videoinput",
				);
				const audioOutputs = devices.filter(
					(device) => device.kind === "audiooutput",
				);

				setAudioDevices(audioInputs);
				setVideoDevices(videoInputs);
				setAudioOutputDevices(audioOutputs);

				// Set default devices
				if (audioInputs.length)
					setSelectedAudioInput(audioInputs[0].deviceId);
				if (videoInputs.length)
					setSelectedVideoInput(videoInputs[0].deviceId);
				if (audioOutputs.length)
					setSelectedAudioOutput(audioOutputs[0].deviceId);
			} catch (error) {
				console.error("Error accessing media devices:", error);
			}
		};

		getDevices();

		// Listen for device changes
		navigator.mediaDevices.addEventListener("devicechange", getDevices);

		return () => {
			navigator.mediaDevices.removeEventListener(
				"devicechange",
				getDevices,
			);
		};
	}, []);

	const toggleMute = () => {
		if (!mediaStreamRef.current) {
			return;
		}
		const audioTrack = mediaStreamRef.current?.getAudioTracks()[0];
		audioTrack.enabled = !audioTrack.enabled;

		setIsMuted((m) => !m);
	};

	const toggleVideo = () => {
		if (!mediaStreamRef.current) {
			return;
		}
		const videoTrack = mediaStreamRef.current.getVideoTracks()[0];
		videoTrack.enabled = !videoTrack.enabled;
		setIsVideoOn((v) => !v);
	};

	const handleAudioInputChange = (deviceId: string) => {
		setSelectedAudioInput(deviceId);
		// Here you would switch the audio input device
	};

	const handleVideoInputChange = (deviceId: string) => {
		setSelectedVideoInput(deviceId);
		// Here you would switch the video input device
	};

	const handleAudioOutputChange = (deviceId: string) => {
		setSelectedAudioOutput(deviceId);
		// Here you would switch the audio output device
	};
	// const handleScreenPresent = async () => {
	// 	try {
	// 		const displayMedia = await navigator.mediaDevices.getDisplayMedia();
	// 		console.log({ displayMedia });
	// 		setScreenPresenting(true);
	// 	} catch (err) {
	// 		console.log(err);
	// 	}
	// };

	const handleScreenPresent = async () => {
		if (screenPresenting) {
			// Stop sharing screen
			const videoTrack = mediaStreamRef.current?.getVideoTracks()[0];
			if (videoTrack) {
				videoTrack.stop(); // Stop the screen sharing track
			}

			// Remove the screen share track from the peer connection
			const senders = peerConnectionRef.current?.getSenders();
			const videoSender = senders?.find(
				(sender) => sender.track?.kind === "video",
			);
			if (videoSender) {
				peerConnectionRef.current?.removeTrack(videoSender); // Remove the existing video track sender
			}

			setScreenPresenting(false); // Update the screenPresenting state
		} else {
			try {
				const displayMedia =
					await navigator.mediaDevices.getDisplayMedia();
				setScreenPresenting(true);
				const screenTrack = displayMedia.getTracks()[0];
				// Stop previous webcam video track if exists
				const webcamTrack = mediaStreamRef.current?.getVideoTracks()[0];
				webcamTrack?.stop();

				// Replace the video track in the media stream
				mediaStreamRef.current?.removeTrack(webcamTrack!); // Remove webcam video track
				mediaStreamRef.current?.addTrack(screenTrack); // Add screen track

				// Replace the video track in the peer connection
				const senders = peerConnectionRef.current?.getSenders();
				const videoSender = senders?.find(
					(sender) => sender.track?.kind === "video",
				);
				if (videoSender) {
					videoSender.replaceTrack(screenTrack); // Replace the existing video track with screen track
				}

				// Optionally, stop sharing screen
				displayMedia.getTracks()[0].onended = () => {
					handleScreenPresent(); // Call handleScreenPresent again if the screen sharing ends
				};
			} catch (err) {
				console.error("Error starting screen share:", err);
			}
		}
	};
	const handleEndCall = () => {
		socket.emit("end-call", { room });
		router.back();
	};
	return (
		<>
			<div className="bg-green fixed bottom-4 left-0 right-0 flex justify-center p-4">
				<div className="flex items-center gap-4 rounded-2xl bg-zinc-800 px-5 py-4 shadow-lg">
					<Button
						variant={isMuted ? "destructive" : "videoControl"}
						size="iconLg"
						// className=""
						onClick={toggleMute}
					>
						{isMuted ? (
							<MicOff
							// className="h-5 w-5"
							/>
						) : (
							<Mic
							// className="h-5 w-5"
							/>
						)}
					</Button>

					<Button
						variant={isVideoOn ? "videoControl" : "destructive"}
						size="iconLg"
						className=""
						onClick={toggleVideo}
					>
						{isVideoOn ? (
							<Video
							// className="h-5 w-5"
							/>
						) : (
							<VideoOff
							// className="h-5 w-5"
							/>
						)}
					</Button>

					<Button
						variant={"videoControl"}
						className={cn(
							screenPresenting &&
								"bg-emerald-600 hover:bg-emerald-700",
						)}
						size={"iconLg"}
						onClick={handleScreenPresent}
					>
						<MonitorSmartphone />
					</Button>

					<Dialog>
						<DialogTrigger asChild>
							<Button
								variant="videoControl"
								size="iconLg"
								className=""
							>
								<Settings
								// className="h-5 w-5"
								/>
							</Button>
						</DialogTrigger>

						<DialogContent className="sm:max-w-[425px]">
							<DialogHeader>
								<DialogTitle>Call Settings</DialogTitle>
							</DialogHeader>
							<div className="grid gap-4 py-4">
								<DeviceSelector
									label="Microphone"
									devices={audioDevices}
									selectedDevice={selectedAudioInput}
									onDeviceChange={handleAudioInputChange}
								/>
								<DeviceSelector
									label="Camera"
									devices={videoDevices}
									selectedDevice={selectedVideoInput}
									onDeviceChange={handleVideoInputChange}
								/>
								<DeviceSelector
									label="Speaker"
									devices={audioOutputDevices}
									selectedDevice={selectedAudioOutput}
									onDeviceChange={handleAudioOutputChange}
								/>
							</div>
						</DialogContent>
					</Dialog>

					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button
								variant="videoControl"
								size="iconLg"
								className=""
							>
								<MoreVertical
								// className="h-5 w-5"
								/>
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end">
							<DropdownMenuItem>
								<Users className="mr-2 h-4 w-4" />
								<span>Show participants</span>
							</DropdownMenuItem>
							<DropdownMenuItem>
								<MonitorSmartphone className="mr-2 h-4 w-4" />
								<span>Present screen</span>
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>

					<Button
						variant="destructive"
						size="iconLg"
						className=""
						onClick={handleEndCall}
					>
						<PhoneOff />
					</Button>
				</div>
			</div>
		</>
	);
};
