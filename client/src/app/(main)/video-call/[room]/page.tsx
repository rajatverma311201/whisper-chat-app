"use client";

import { VideoCallControls } from "@/components/video-call/video-call-controls";
import { useAuthUser } from "@/hooks/auth/use-auth-user";
import { useSocket } from "@/hooks/global/use-socket";
import { useVideoCallStore } from "@/hooks/global/use-video-call-store";
import { SocketConst } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import {
	MutableRefObject,
	useCallback,
	useEffect,
	useRef,
	useState,
} from "react";

const iceServers = [
	{ urls: "stun:stun.l.google.com:19302" },
	{ urls: "stun:stun.l.google.com:5349" },
	{ urls: "stun:stun1.l.google.com:3478" },
	{ urls: "stun:stun1.l.google.com:5349" },
	{ urls: "stun:stun2.l.google.com:19302" },
	{ urls: "stun:stun2.l.google.com:5349" },
	{ urls: "stun:stun3.l.google.com:3478" },
	{ urls: "stun:stun3.l.google.com:5349" },
	{ urls: "stun:stun4.l.google.com:19302" },
	{ urls: "stun:stun4.l.google.com:5349" },
];

interface VideoCallPageProps {
	params: { room: string };
	searchParams: Record<string, string>;
}

const VideoCallPage: React.FC<VideoCallPageProps> = ({
	params,
	searchParams,
}) => {
	const { room } = params;
	const { action, receiverUserId } = searchParams;

	const { currentUser } = useAuthUser();
	const { socket } = useSocket();
	const router = useRouter();

	const userVideoRef = useRef<HTMLVideoElement | null>(null);
	const partnerVideoRef = useRef<HTMLVideoElement | null>(null);
	const mediaStreamRef = useRef<MediaStream | null>(null);
	const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
	const [screenSharingTrack, setScreenSharingTrack] =
		useState<MediaStreamTrack | null>(null);

	const [selectedAudioInput, setSelectedAudioInput] = useState<string>("");
	const [selectedVideoInput, setSelectedVideoInput] = useState<string>("");
	const [selectedAudioOutput, setSelectedAudioOutput] = useState<string>("");

	// const { isCallActive, setCallActive } = useVideoCallStore();

	const cleanupFn = useCallback(() => {
		mediaStreamRef.current?.getTracks().forEach((track) => track.stop());
		peerConnectionRef.current?.close();
		// socket.emit("leave-room", { room });
	}, []);

	useEffect(() => {
		socket
			.emitWithAck("join-room", {
				room,
			})
			.then(({ success }) => {
				if (success) {
					socket.emit(SocketConst.PERSONAL_CHAT_MAKE_CALL, {
						to: receiverUserId,
						room,
					});
				}
			});

		return () => {
			socket.emit("leave-room", { room });
			cleanupFn();
		};
	}, [cleanupFn, socket, room, receiverUserId]);

	useEffect(() => {
		// if (!selectedAudioInput || !selectedVideoInput) {
		// 	console.log({ selectedAudioInput, selectedVideoInput });
		// 	return;
		// }
		const fn = async () => {
			try {
				const stream = await navigator.mediaDevices.getUserMedia({
					audio:
						selectedAudioInput == "default" || !selectedAudioInput
							? true
							: { deviceId: { exact: selectedAudioInput } },
					video:
						selectedVideoInput == "default" || !selectedVideoInput
							? true
							: { deviceId: { exact: selectedVideoInput } },
				});
				mediaStreamRef.current = stream;

				if (userVideoRef.current) {
					userVideoRef.current.srcObject = stream;
				}

				peerConnectionRef.current = new RTCPeerConnection({
					iceServers,
				});

				stream.getTracks().forEach((track) => {
					peerConnectionRef.current?.addTrack(track, stream);
				});

				peerConnectionRef.current.addEventListener(
					"icecandidate",
					(event) => {
						if (event.candidate) {
							socket.emit("icecandidate", {
								room,
								candidate: event.candidate,
							});
						}
					},
				);

				peerConnectionRef.current.addEventListener("track", (event) => {
					if (partnerVideoRef.current) {
						partnerVideoRef.current.srcObject = event.streams[0];
					}
				});

				const localSDP = await peerConnectionRef.current?.createOffer();
				await peerConnectionRef.current?.setLocalDescription(localSDP);

				socket.emit("offer", {
					room,
					sdp: localSDP,
				});
			} catch (error) {
				console.log({ error });
			}
		};
		fn();

		return () => cleanupFn();
	}, [cleanupFn, room, socket, selectedAudioInput, selectedVideoInput]);

	useEffect(() => {
		const handleOffer = async (data: any) => {
			await peerConnectionRef.current?.setRemoteDescription(
				new RTCSessionDescription(data.sdp),
			);

			const answer = await peerConnectionRef.current?.createAnswer();
			await peerConnectionRef.current?.setLocalDescription(answer);

			socket.emit("answer", { room, sdp: answer });
		};

		const handleAnswer = async ({ sdp }: any) => {
			await peerConnectionRef.current?.setRemoteDescription(
				new RTCSessionDescription(sdp),
			);
		};

		const handleIceCandidate = async (data: any) => {
			if (peerConnectionRef.current && data.candidate) {
				await peerConnectionRef.current.addIceCandidate(
					new RTCIceCandidate(data.candidate),
				);
			}
		};
		const handleEndCall = () => {
			router.back();
		};

		socket.on("offer", handleOffer);
		socket.on("answer", handleAnswer);
		socket.on("icecandidate", handleIceCandidate);
		socket.on("end-call", handleEndCall);

		return () => {
			// socket.off("offer");
			// socket.off("answer");
			// socket.off("icecandidate");
			// socket.off("end-call");

			["offer", "answer", "icecandidate", "end-call"].forEach((event) => {
				socket.off(event);
			});

			cleanupFn();
		};
	}, [socket, room, cleanupFn, router]);

	const handleScreenShare = (track: MediaStreamTrack) => {
		setScreenSharingTrack(track);
	};

	// return (
	// 	<div className="h-screen bg-zinc-900">
	// 		<h1 className="py-5 text-center text-xl text-white">Video Call</h1>
	// 		<div className="flex h-full flex-wrap items-center justify-center gap-5">
	// 			<div className="relative overflow-hidden rounded-lg">
	// 				<span className="absolute bottom-2 left-2 rounded-lg bg-gray-800/50 px-4 py-2 text-white">
	// 					{currentUser?.name} (YOU)
	// 				</span>
	// 				<video
	// 					ref={userVideoRef}
	// 					autoPlay
	// 					muted
	// 					playsInline
	// 					className="h-auto w-auto"
	// 				/>
	// 			</div>
	// 			<div>
	// 				<video
	// 					ref={partnerVideoRef}
	// 					autoPlay
	// 					playsInline
	// 					className="h-auto w-auto rounded-lg"
	// 				/>
	// 			</div>
	// 		</div>

	// 		<VideoCallControls
	// 			room={room}
	// 			mediaStreamRef={mediaStreamRef}
	// 			peerConnectionRef={peerConnectionRef}
	// 		/>
	// 	</div>
	// );

	return (
		<>
			<div className="flex h-screen flex-col overflow-scroll bg-zinc-900 text-white">
				<h1 className="py-5 text-center text-xl">Video Call</h1>
				<div className="flex flex-1 flex-col items-center justify-center gap-5 p-5 lg:flex-row">
					<div className="relative aspect-video w-full max-w-3xl overflow-hidden rounded-lg border border-gray-700 sm:w-2/3">
						<span className="absolute bottom-2 left-2 rounded-lg border bg-gray-800/50 px-4 py-2 text-sm text-white">
							{currentUser?.name} (YOU)
						</span>
						<video
							ref={userVideoRef}
							autoPlay
							muted
							playsInline
							className="h-full w-full rounded-lg object-cover"
						/>
					</div>
					<div className="relative aspect-video w-full max-w-3xl overflow-hidden rounded-lg border border-gray-700 sm:w-2/3">
						<video
							ref={partnerVideoRef}
							autoPlay
							playsInline
							className="h-full w-full rounded-lg object-cover"
						/>
					</div>
				</div>
				<VideoCallControls
					room={room}
					mediaStreamRef={mediaStreamRef}
					peerConnectionRef={peerConnectionRef}
					onScreenShare={setScreenSharingTrack}
					selectedAudioInput={selectedAudioInput}
					selectedAudioOutput={selectedAudioOutput}
					selectedVideoInput={selectedVideoInput}
					setSelectedAudioInput={setSelectedAudioInput}
					setSelectedAudioOutput={setSelectedAudioOutput}
					setSelectedVideoInput={setSelectedVideoInput}
					userVideoRef={userVideoRef}
					partnerVideoRef={partnerVideoRef}
				/>
			</div>
		</>
	);
};

export default VideoCallPage;

/*
const attachEventListenersToPeerConnectionRef = (
	peerConnectionRef: MutableRefObject<RTCPeerConnection | null>,
) => {
	if (!peerConnectionRef.current) {
		return;
	}
	peerConnectionRef.current.addEventListener("icecandidateerror", (event) => {
	});

	peerConnectionRef.current.addEventListener("negotiationneeded", (event) => {
	});
	peerConnectionRef.current.addEventListener("datachannel", (event) => {
	});
	peerConnectionRef.current.addEventListener(
		"connectionstatechange",
		(event) => {
		},
	);
	peerConnectionRef.current.addEventListener(
		"iceconnectionstatechange",
		(event) => {
		},
	);
	peerConnectionRef.current.addEventListener(
		"icegatheringstatechange",
		(event) => {
		},
	);
};
*/
