"use client";
import { useAuthUser } from "@/hooks/auth/use-auth-user";
import { useSocket } from "@/hooks/global/use-socket";
import { SocketConst } from "@/lib/constants";
import { error } from "console";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

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

	const [isReceivingCall, setIsReceivingCall] = useState(false);
	const [isCallActive, setIsCallActive] = useState(false);
	const [callerSignal, setCallerSignal] = useState<any>(null);

	const userVideoRef = useRef<HTMLVideoElement | null>(null);
	const partnerVideoRef = useRef<HTMLVideoElement | null>(null);
	const mediaStreamRef = useRef<MediaStream | null>(null);
	const peerConnectionRef = useRef<RTCPeerConnection | null>(null);

	const initializePeerConnection = useCallback(() => {
		peerConnectionRef.current = new RTCPeerConnection({
			iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
		});

		window.peerConnectionRef = peerConnectionRef;

		peerConnectionRef.current.addEventListener(
			"icecandidateerror",
			(event) => {
				console.log("ICE CANDIDATE ERROR = ", event);
			},
		);

		peerConnectionRef.current.addEventListener(
			"negotiationneeded",
			(event) => {
				console.log("negotiation = ", event);
			},
		);
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

		peerConnectionRef.current.addEventListener("icecandidate", (event) => {
			console.log("HELLO");
			if (event.candidate) {
				socket.emit("sendICECandidate", {
					to: userId,
					candidate: event.candidate,
				});
			}
		});

		peerConnectionRef.current.addEventListener("track", (event) => {
			if (partnerVideoRef.current) {
				partnerVideoRef.current.srcObject = event.streams[0];
			}
		});

		makeCall();
	}, [socket, userId]);

	useEffect(() => {
		const setupMedia = async () => {
			try {
				const stream = await navigator.mediaDevices.getUserMedia({
					audio: true,
					video: true,
				});
				mediaStreamRef.current = stream;
				if (userVideoRef.current)
					userVideoRef.current.srcObject = stream;
				initializePeerConnection();

				stream
					.getTracks()
					.forEach((track) =>
						peerConnectionRef.current?.addTrack(track, stream),
					);
			} catch (error) {
				console.error("Error accessing media devices:", error);
				toast.error("Failed to access camera/microphone");
			}
		};

		setupMedia();

		return () => cleanup();
	}, [initializePeerConnection]);

	const cleanup = () => {
		mediaStreamRef.current?.getTracks().forEach((track) => track.stop());
		peerConnectionRef.current?.close();
		mediaStreamRef.current = null;
		peerConnectionRef.current = null;
	};

	const makeCall = useCallback(async () => {
		if (!peerConnectionRef.current) return;
		console.log("MAKE CALL");
		const offer = await peerConnectionRef.current.createOffer();
		await peerConnectionRef.current.setLocalDescription(offer);
		socket.emit(SocketConst.PERSONAL_CHAT_MAKE_CALL, {
			makeCallTo: userId,
			signalData: offer,
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
		setIsCallActive(true);
	}, [callerSignal, socket, userId]);

	const endCall = () => {
		socket.emit(SocketConst.PERSONAL_CHAT_END_CALL, { to: userId });
		cleanup();
		router.back();
	};

	useEffect(() => {
		socket.on(SocketConst.PERSONAL_CHAT_INCOMING_CALL, (data) => {
			setIsReceivingCall(true);
			setCallerSignal(data.signalData);
		});

		socket.on(
			SocketConst.PERSONAL_CHAT_ACCEPTED_INCOMING_CALL,
			async (data) => {
				if (peerConnectionRef.current) {
					await peerConnectionRef.current.setRemoteDescription(
						new RTCSessionDescription(data.signal),
					);
					setIsCallActive(true);
				}
			},
		);

		socket.on(SocketConst.PERSONAL_CHAT_REJECTED_INCOMING_CALL, () => {
			toast.error("Call rejected by the receiver");
			cleanup();
			router.back();
		});

		socket.on("receiveICECandidate", async (data) => {
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

		if (action === "accept" && callerSignal) answerCall();
		else if (!action) makeCall();

		return () => {
			socket.off(SocketConst.PERSONAL_CHAT_INCOMING_CALL);
			socket.off(SocketConst.PERSONAL_CHAT_ACCEPTED_INCOMING_CALL);
			socket.off(SocketConst.PERSONAL_CHAT_REJECTED_INCOMING_CALL);
			socket.off("receiveICECandidate");
			socket.off(SocketConst.PERSONAL_CHAT_END_CALL);
		};
	}, [socket, action, callerSignal, answerCall, makeCall, router]);

	return (
		<div>
			<h1>Video Call</h1>
			<div>
				<video
					ref={userVideoRef}
					autoPlay
					muted
					playsInline
					style={{ width: "300px" }}
				/>
				{isCallActive && (
					<video
						ref={partnerVideoRef}
						autoPlay
						playsInline
						style={{ width: "300px" }}
					/>
				)}
			</div>
			{isReceivingCall && !isCallActive && (
				<button onClick={answerCall}>Answer Call</button>
			)}
			{isCallActive && <button onClick={endCall}>End Call</button>}
		</div>
	);
};

export default VideoCallPage;
