"use client";
import { Button } from "@/components/ui/button";

import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
} from "@/components/ui/select";
import { useAuthUser } from "@/hooks/auth/use-auth-user";
import { useSocket } from "@/hooks/global/use-socket";
import { useVideoCallStore } from "@/hooks/global/use-video-call-store";
import { SocketConst } from "@/lib/constants";
import { cn } from "@/lib/utils";
import {
	ArrowBigUpIcon,
	ChevronUp,
	Mic,
	MicOff,
	Video,
	VideoOff,
} from "lucide-react";
import { useRouter } from "next/navigation";
import {
	MutableRefObject,
	useCallback,
	useEffect,
	useRef,
	useState,
} from "react";
import { toast } from "sonner";

interface VideoCallPageProps {
	params: { userId: string };
	searchParams: Record<string, string>;
}

const VideoCallPage: React.FC<VideoCallPageProps> = ({
	params,
	searchParams,
}) => {
	const { userId } = params;
	const { action, roomId } = searchParams;

	const { currentUser } = useAuthUser();
	const { socket } = useSocket();
	const router = useRouter();

	const userVideoRef = useRef<HTMLVideoElement | null>(null);
	const partnerVideoRef = useRef<HTMLVideoElement | null>(null);
	const mediaStreamRef = useRef<MediaStream | null>(null);
	const peerConnectionRef = useRef<RTCPeerConnection | null>(null);

	const [audioCtrlPopoverOpen, setAudioCtrlPopoverOpen] = useState(false);
	const [videoCtrlPopoverOpen, setVideoCtrlPopoverOpen] = useState(false);

	const [micOn, setMicOn] = useState(true);
	const [cameraOn, setCameraOn] = useState(true);
	const [screenPresenting, setScreenPresenting] = useState(false);

	const [mediaDevices, setMediaDevices] = useState<MediaDevicesI>();
	const [audioInputDevice, setAudioInputDevice] =
		useState<Nullable<string>>(null);
	const [videoInputDevice, setVideoInputDevice] =
		useState<Nullable<string>>(null);
	const [audioOutputDevice, setAudioOutputDevice] =
		useState<Nullable<string>>(null);

	const {
		isCallActive,
		isReceivingCall,
		setCallActive,
		callerSignal,
		resetCallState,
	} = useVideoCallStore();

	const makeCall = useCallback(async () => {
		if (!peerConnectionRef.current) return;
		const offer = await peerConnectionRef.current.createOffer();
		await peerConnectionRef.current.setLocalDescription(offer);
		socket.emit(SocketConst.PERSONAL_CHAT_MAKE_CALL, {
			makeCallTo: userId,
			callerSignal: offer,
			caller: currentUser?._id,
		});
	}, [currentUser?._id, userId, socket]);

	const answerCall = useCallback(async () => {
		if (!peerConnectionRef.current || !callerSignal) return;

		await peerConnectionRef.current.setRemoteDescription(
			new RTCSessionDescription(callerSignal),
		);

		const answer = await peerConnectionRef.current.createAnswer();

		await peerConnectionRef.current.setLocalDescription(answer);
		socket.emit(SocketConst.PERSONAL_CHAT_ACCEPT_INCOMING_CALL, {
			targetUserId: userId,
			signal: answer,
		});
		setCallActive(true);
	}, [callerSignal, socket, userId, setCallActive]);

	const cleanup = useCallback(() => {
		mediaStreamRef.current?.getTracks().forEach((track) => track.stop());
		peerConnectionRef.current?.close();

		mediaStreamRef.current = null;
		peerConnectionRef.current = null;

		resetCallState();
	}, [resetCallState]);

	useEffect(() => {
		const setupMedia = async () => {
			try {
				const stream = await navigator.mediaDevices.getUserMedia({
					audio: true,
					video: true,
				});
				mediaStreamRef.current = stream;

				if (userVideoRef.current) {
					userVideoRef.current.srcObject = stream;
				}

				peerConnectionRef.current = new RTCPeerConnection({
					iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
				});

				peerConnectionRef.current.addEventListener(
					"icecandidate",
					(event) => {
						if (event.candidate) {
							socket.emit(SocketConst.SEND_ICE_CANDIDATE, {
								to: userId,
								candidate: event.candidate,
							});
						}
					},
				);

				peerConnectionRef.current.addEventListener("track", (event) => {
					if (partnerVideoRef.current) {
						console.log("eventStreams = ", {
							eventSt: event.streams,
						});
						partnerVideoRef.current.srcObject = event.streams[0];
					}
				});

				// attachEventListenersToPeerConnectionRef(peerConnectionRef);

				stream
					.getTracks()
					.forEach((track) =>
						peerConnectionRef.current?.addTrack(track, stream),
					);
				if (!action) {
					makeCall();
				} else if (action == "accept") {
					answerCall();
				}
			} catch (error) {
				console.error("Error accessing media devices:", error);
				toast.error("Failed to access camera/microphone");
			}
		};

		setupMedia();

		return () => cleanup();
	}, [action, makeCall, answerCall, socket, userId, cleanup]);

	useEffect(() => {
		socket.on(
			SocketConst.PERSONAL_CHAT_ACCEPTED_INCOMING_CALL,
			async (data) => {
				if (peerConnectionRef.current) {
					await peerConnectionRef.current.setRemoteDescription(
						new RTCSessionDescription(data.signal),
					);
					setCallActive(true);
				}
			},
		);

		socket.on(SocketConst.PERSONAL_CHAT_REJECTED_INCOMING_CALL, () => {
			toast.error("Call rejected by the receiver");
			cleanup();
			router.back();
		});

		socket.on(SocketConst.RECEIVE_ICE_CANDIDATE, async (data) => {
			if (peerConnectionRef.current && data.candidate) {
				await peerConnectionRef.current.addIceCandidate(
					new RTCIceCandidate(data.candidate),
				);
			}
		});

		socket.on(SocketConst.PERSONAL_CHAT_END_CALL, () => {
			cleanup();
			router.back();
		});

		return () => {
			socket.off(SocketConst.PERSONAL_CHAT_ACCEPTED_INCOMING_CALL);
			socket.off(SocketConst.PERSONAL_CHAT_REJECTED_INCOMING_CALL);
			socket.off(SocketConst.RECEIVE_ICE_CANDIDATE);
			socket.off(SocketConst.PERSONAL_CHAT_END_CALL);
		};
	}, [socket, router, setCallActive, cleanup]);

	const endCall = () => {
		socket.emit(SocketConst.PERSONAL_CHAT_END_CALL, { userId });
		cleanup();
		router.back();
	};

	useEffect(() => {
		const fn = async () => {
			const audioD: MediaDevicesI["audio"] = { input: [], output: [] };
			const videoD: MediaDevicesI["video"] = { input: [], output: [] };

			const devices = await navigator.mediaDevices.enumerateDevices();

			devices.forEach((device) => {
				switch (device.kind) {
					case "audioinput":
						audioD.input.push({
							deviceId: device.deviceId,
							label: device.label,
						});
						break;
					case "audiooutput":
						audioD.output.push({
							deviceId: device.deviceId,
							label: device.label,
						});
						break;
					case "videoinput":
						videoD.input.push({
							deviceId: device.deviceId,
							label: device.label,
						});
						break;
					default:
						break;
				}
			});

			setMediaDevices({ audio: audioD, video: videoD });
		};
		fn();
	}, []);

	const toggleCamera = () => {
		if (!mediaStreamRef.current) {
			return;
		}
		const videoTrack = mediaStreamRef.current.getVideoTracks()[0];
		videoTrack.enabled = !videoTrack.enabled;
		setCameraOn((cam) => !cam);
	};
	const toggleMic = () => {
		if (!mediaStreamRef.current) {
			return;
		}
		const audioTrack = mediaStreamRef.current?.getAudioTracks()[0];
		audioTrack.enabled = !audioTrack.enabled;
		setMicOn((mic) => !mic);
	};

	const handleScreenPresent = async () => {
		try {
			const displayMedia = await navigator.mediaDevices.getDisplayMedia();
			console.log({ displayMedia });
			setScreenPresenting(true);
		} catch (err) {
			console.log(err);
		}
	};

	const handleAudioInputChange = async (deviceId: string) => {
		if (!mediaStreamRef.current) {
			return;
		}

		const stream = await navigator.mediaDevices.getUserMedia({
			audio: { deviceId: { exact: deviceId } },
			video: false,
		});

		const oldAudioTrack = mediaStreamRef.current.getAudioTracks()[0];

		mediaStreamRef.current.removeTrack(oldAudioTrack);
		oldAudioTrack.stop();

		const newAudioTrack = stream.getAudioTracks()[0];
		mediaStreamRef.current.addTrack(newAudioTrack);
		setAudioInputDevice(deviceId);
	};

	const handleVideoInputChange = async (deviceId: string) => {
		if (!mediaStreamRef.current) {
			return;
		}
		const stream = await navigator.mediaDevices.getUserMedia({
			audio: false,
			video: { deviceId: { exact: deviceId } },
		});
		const oldVideoTrack = mediaStreamRef.current.getVideoTracks()[0];

		mediaStreamRef.current.removeTrack(oldVideoTrack);
		oldVideoTrack.stop();

		const newVideoTrack = stream.getVideoTracks()[0];
		mediaStreamRef.current.addTrack(newVideoTrack);
		setVideoInputDevice(deviceId);
	};

	const handleAudioOutputChange = (deviceId: string) => {
		if (!userVideoRef.current || !partnerVideoRef.current) {
			return;
		}

		const audioElement1 = userVideoRef.current; // Assuming you use this for local video

		audioElement1
			.setSinkId(deviceId)
			.then(() => {
				setAudioOutputDevice(deviceId);
			})
			.catch((err) => {
				console.error("Error setting audio output device:", err);
			});

		const audioElement2 = partnerVideoRef.current;
		audioElement2
			.setSinkId(deviceId)
			.then(() => {
				setAudioOutputDevice(deviceId);
			})
			.catch((err) => {
				console.error("Error setting audio output device:", err);
			});
	};

	return (
		<div className="h-full bg-zinc-900">
			<h1 className="py-5 text-center text-xl text-white">Video Call</h1>
			<div className="flex flex-wrap items-center justify-center gap-5">
				<div className="relative overflow-hidden rounded-lg">
					<span className="absolute bottom-2 left-2 rounded-lg bg-gray-800/50 px-4 py-2 text-white">
						{currentUser?.name} (YOU)
					</span>
					<video
						ref={userVideoRef}
						autoPlay
						muted
						playsInline
						className=""
					/>
				</div>
				<div className={cn(!isCallActive && "hidden")}>
					<video
						ref={partnerVideoRef}
						autoPlay
						playsInline
						className="rounded-lg"
					/>
				</div>
			</div>

			<div className="p-5">
				<div className="mx-auto flex max-w-[500px] items-center justify-center gap-4 rounded-lg bg-zinc-800 p-4">
					<div className="flex rounded-md border-2 border-zinc-700">
						<Popover
							open={audioCtrlPopoverOpen}
							onOpenChange={setAudioCtrlPopoverOpen}
						>
							<PopoverTrigger className="h-12 w-12 text-gray-200">
								<ChevronUp
									className={cn(
										"mx-auto origin-center transition-transform",
										audioCtrlPopoverOpen && "rotate-180",
									)}
								/>
							</PopoverTrigger>
							<PopoverContent className="flex flex-col gap-2">
								<Select onValueChange={handleAudioInputChange}>
									<SelectTrigger>
										{
											mediaDevices?.audio.input.find(
												(item) =>
													item.deviceId ==
													audioInputDevice,
											)?.label
										}
									</SelectTrigger>
									<SelectContent>
										{mediaDevices?.audio.input.map(
											(item, idx) => (
												<SelectItem
													key={idx}
													value={item.deviceId}
												>
													{item.label}
												</SelectItem>
											),
										)}
									</SelectContent>
								</Select>
								<hr />
								<Select onValueChange={handleAudioOutputChange}>
									<SelectTrigger></SelectTrigger>
									<SelectContent>
										{mediaDevices?.audio.output.map(
											(item, idx) => (
												<SelectItem
													key={idx}
													value={item.deviceId}
												>
													{item.label}
												</SelectItem>
											),
										)}
									</SelectContent>
								</Select>
							</PopoverContent>
						</Popover>
						<Button
							size={"videoControl"}
							variant={"videoControl"}
							onClick={toggleMic}
							className={cn(
								micOn
									? ""
									: "bg-destructive hover:bg-destructive/75",
							)}
						>
							{micOn ? <Mic /> : <MicOff />}
						</Button>
					</div>

					<div className="flex rounded-md border-2 border-zinc-700">
						<Popover
							open={videoCtrlPopoverOpen}
							onOpenChange={setVideoCtrlPopoverOpen}
						>
							<PopoverTrigger className="h-12 w-12 text-gray-200">
								<ChevronUp
									className={cn(
										"mx-auto origin-center transition-transform",
										videoCtrlPopoverOpen && "rotate-180",
									)}
								/>
							</PopoverTrigger>
							<PopoverContent>
								<Select onValueChange={handleVideoInputChange}>
									<SelectTrigger></SelectTrigger>
									<SelectContent>
										<>
											{mediaDevices?.video.input.map(
												(item, idx) => (
													<SelectItem
														key={idx}
														value={item.deviceId}
													>
														{item.label}
													</SelectItem>
												),
											)}
										</>
									</SelectContent>
								</Select>
							</PopoverContent>
						</Popover>
						<Button
							size={"videoControl"}
							variant={"videoControl"}
							onClick={toggleCamera}
							className={cn(
								cameraOn
									? ""
									: "bg-destructive hover:bg-destructive/75",
							)}
						>
							{cameraOn ? <Video /> : <VideoOff />}
						</Button>
					</div>

					<div>
						<Button
							size={"videoControl"}
							variant={"videoControl"}
							onClick={handleScreenPresent}
							className={cn(
								screenPresenting
									? "bg-primary hover:bg-primary/75"
									: "",
							)}
						>
							<ArrowBigUpIcon />
						</Button>
					</div>
				</div>
			</div>
			{isReceivingCall && !isCallActive && (
				<button onClick={answerCall}>Answer Call</button>
			)}
			{isCallActive && <button onClick={endCall}>End Call</button>}
		</div>
	);
};

export default VideoCallPage;

const attachEventListenersToPeerConnectionRef = (
	peerConnectionRef: MutableRefObject<RTCPeerConnection | null>,
) => {
	if (!peerConnectionRef.current) {
		return;
	}
	peerConnectionRef.current.addEventListener("icecandidateerror", (event) => {
		// console.log("ICE CANDIDATE ERROR = ", event);
	});

	peerConnectionRef.current.addEventListener("negotiationneeded", (event) => {
		// console.log("negotiation = ", event);
	});
	peerConnectionRef.current.addEventListener("datachannel", (event) => {
		// console.log("datachannel = ", event);
	});
	peerConnectionRef.current.addEventListener(
		"connectionstatechange",
		(event) => {
			// console.log("connectionstatechange = ", event);
		},
	);
	peerConnectionRef.current.addEventListener(
		"iceconnectionstatechange",
		(event) => {
			// console.log("iceconnectionstatechange = ", event);
		},
	);
	peerConnectionRef.current.addEventListener(
		"icegatheringstatechange",
		(event) => {
			// console.log("icegatheringstatechange = ", event);
		},
	);
};
