"use client";

import { VideoCallControls } from "@/components/video-call/video-call-controls";
import { useAuthUser } from "@/hooks/auth/use-auth-user";
import { useSocket } from "@/hooks/global/use-socket";
import { useVideoCallStore } from "@/hooks/global/use-video-call-store";
import { SocketConst } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { MutableRefObject, useCallback, useEffect, useRef } from "react";

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

	// const { isCallActive, setCallActive } = useVideoCallStore();

	const cleanupFn = useCallback(() => {
		mediaStreamRef.current?.getTracks().forEach((track) => track.stop());
		peerConnectionRef.current?.close();
		socket.emit("leave-room", { room });
	}, [socket, room]);

	useEffect(() => {
		console.log("hello");
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
			})
			.catch(console.log);

		return () => cleanupFn();
	}, [cleanupFn, socket, room, receiverUserId]);

	useEffect(() => {
		const fn = async () => {
			const stream = await navigator.mediaDevices.getUserMedia({
				audio: true,
				video: true,
			});
			mediaStreamRef.current = stream;

			if (userVideoRef.current) {
				userVideoRef.current.srcObject = stream;
			}

			peerConnectionRef.current = new RTCPeerConnection({
				iceServers,
			});

			stream.getTracks().forEach((track) => {
				console.log({ track });
				peerConnectionRef.current?.addTrack(track, stream);
			});

			console.log({ peerConnectionRef });
			peerConnectionRef.current.addEventListener(
				"icecandidate",
				(event) => {
					console.log({ event });
					if (event.candidate) {
						socket.emit("icecandidate", {
							room,
							candidate: event.candidate,
						});
					}
				},
			);

			peerConnectionRef.current.addEventListener("track", (event) => {
				console.log("eventStreams = ", {
					eventSt: event,
				});
				if (partnerVideoRef.current) {
					console.log("eventStreams = ", {
						eventSt: event.streams,
					});
					partnerVideoRef.current.srcObject = event.streams[0];
				}
			});

			const localSDP = await peerConnectionRef.current?.createOffer();
			await peerConnectionRef.current?.setLocalDescription(localSDP);
			console.log({ localSDP });

			socket.emit("offer", {
				room,
				sdp: localSDP,
			});
		};
		fn();

		return () => cleanupFn();
	}, [cleanupFn, room, socket]);

	useEffect(() => {
		const handleOffer = async (data: any) => {
			console.log("data from offer", { data });
			await peerConnectionRef.current?.setRemoteDescription(
				new RTCSessionDescription(data.sdp),
			);

			const answer = await peerConnectionRef.current?.createAnswer();
			await peerConnectionRef.current?.setLocalDescription(answer);

			socket.emit("answer", { room, sdp: answer });
		};

		const handleAnswer = async ({ sdp }: any) => {
			console.log("GOT ANSWER", { sdp });
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
			socket.off("offer", handleOffer);
			socket.off("answer", handleAnswer);
			socket.off("icecandidate", handleIceCandidate);
			cleanupFn();
		};
	}, [socket, room, cleanupFn, router]);

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
				<div
				// className={cn(!isCallActive && "hidden")}
				>
					<video
						ref={partnerVideoRef}
						autoPlay
						playsInline
						className="rounded-lg"
					/>
				</div>
			</div>

			<VideoCallControls
				room={room}
				mediaStreamRef={mediaStreamRef}
				peerConnectionRef={peerConnectionRef}
			/>
		</div>
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
		console.log("ICE CANDIDATE ERROR = ", event);
	});

	peerConnectionRef.current.addEventListener("negotiationneeded", (event) => {
		console.log("negotiation = ", event);
	});
	peerConnectionRef.current.addEventListener("datachannel", (event) => {
		console.log("datachannel = ", event);
	});
	peerConnectionRef.current.addEventListener(
		"connectionstatechange",
		(event) => {
			console.log("connectionstatechange = ", event);
		},
	);
	peerConnectionRef.current.addEventListener(
		"iceconnectionstatechange",
		(event) => {
			console.log("iceconnectionstatechange = ", event);
		},
	);
	peerConnectionRef.current.addEventListener(
		"icegatheringstatechange",
		(event) => {
			console.log("icegatheringstatechange = ", event);
		},
	);
};
*/
