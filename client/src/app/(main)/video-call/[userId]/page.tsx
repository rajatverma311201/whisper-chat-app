"use client";
import { useAuthUser } from "@/hooks/auth/use-auth-user";
import { useSocket } from "@/hooks/global/use-socket";
import { SocketConst } from "@/lib/constants";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

interface VideoCallPageProps {
	params: {
		userId: string;
	};
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

	const [isReceivingCall, setIsReceivingCall] = useState<boolean>(false);
	const [isCallActive, setIsCallActive] = useState<boolean>(false);

	const mediaStreamRef = useRef<MediaStream | null>(null);
	const userVideoRef = useRef<HTMLVideoElement | null>(null);
	const partnerVideo = useRef<HTMLVideoElement | null>(null);

	const peerConnectionRef = useRef<RTCPeerConnection | null>(
		new RTCPeerConnection({
			iceServers: [{ urls: "stun:stun.l.google.com:19302" }], // Google STUN server
		}),
	);

	const router = useRouter();

	const otherUserId = userId;
	const currentUserId = currentUser?._id;

	useEffect(() => {
		socket.on(SocketConst.PERSONAL_CHAT_REJECTED_INCOMING_CALL, () => {
			toast.error("Call rejected by the receiver");
			const tracks = mediaStreamRef.current?.getTracks();
			tracks?.forEach((track) => {
				track.stop();
				console.log(track);
			});
			setTimeout(() => {
				router.back();
			}, 1000);
		});

		return () => {
			socket.off(SocketConst.PERSONAL_CHAT_REJECTED_INCOMING_CALL);
		};
	}, [socket, router]);

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

			stream.getTracks().forEach((track) => {
				peerConnectionRef.current?.addTrack(track, stream);
			});
		};
		fn();

		return () => {
			const tracks = mediaStreamRef.current?.getTracks();
			tracks?.forEach((track) => {
				track.stop();
				console.log(track);
			});
			mediaStreamRef.current = null;
		};
	}, []);

	const makeCall = async () => {
		if (!peerConnectionRef.current) {
			return;
		}
		const offer = await peerConnectionRef.current?.createOffer();
		await peerConnectionRef.current?.setLocalDescription(offer);

		socket.emit(SocketConst.PERSONAL_CHAT_MAKE_CALL, {
			makeCallTo: userId,
			signalData: offer,
			caller: currentUserId,
		});

		peerConnectionRef.current.addEventListener("track", (event) => {
			userVideoRef.current!.srcObject = event.streams[0];
		});

		peerConnectionRef.current.addEventListener("icecandidate", (event) => {
			if (event.candidate) {
				socket.emit("sendICECandidate", {
					to: otherUserId,
					candidate: event.candidate,
				});
			}
		});
	};

	const answerCall = () => {
		socket.emit(SocketConst.PERSONAL_CHAT_ACCEPT_INCOMING_CALL, {
			targetUserId: otherUserId,
		});
		setIsCallActive(true);
	};

	useEffect(() => {
		socket.emit(SocketConst.PERSONAL_CHAT_MAKE_CALL, {
			makeCallTo: userId,
		});
	}, [socket, userId]);

	return (
		<>
			<h1>VideoCallPage</h1>
			<div>
				<h2>Video Call</h2>
				{isReceivingCall && (
					<button onClick={answerCall}>Answer Call</button>
				)}
				<video ref={userVideoRef} autoPlay muted />
				{isCallActive && (
					<dialog open>
						<video ref={partnerVideo} autoPlay />
					</dialog>
				)}
			</div>
		</>
	);
};
export default VideoCallPage;

/*


navigator.mediaDevices
			.getUserMedia({ video: true, audio: true })
			.then((stream) => {
				if (userVideo.current) {
					userVideo.current.srcObject = stream;
				}

				socket.emit("join-call", currentUserId);

				// Listen for incoming call
				socket.on(
					SocketConst.PERSONAL_CHAT_INCOMING_CALL,
					(callerId: string) => {
						setIsReceivingCall(true);
					},
				);

				// Listen for when the other user accepts the call
				socket.on(
					SocketConst.PERSONAL_CHAT_ACCEPTED_INCOMING_CALL,
					(peerConnectionData: any) => {
						setIsCallActive(true);
						startCall(peerConnectionData);
					},
				);

				// Handle receiving ICE candidates
				socket.on(
					SocketConst.RECEIVE_ICE_CANDIDATE,
					handleIceCandidate,
				);

				return () => {
					socket.off(SocketConst.PERSONAL_CHAT_INCOMING_CALL);
					socket.off(
						SocketConst.PERSONAL_CHAT_ACCEPTED_INCOMING_CALL,
					);
					socket.off(SocketConst.RECEIVE_ICE_CANDIDATE);
				};
			})
			.catch((err) => console.log("Error accessing media devices:", err));



*/

/*


	const startCall = useCallback(
		async (peerConnectionData: any) => {
			peerConnection.current = new RTCPeerConnection({
				iceServers: [
					{
						urls: "stun:stun.l.google.com:19302",
					},
				],
			});

			peerConnection.current.onicecandidate = (e) => {
				if (e.candidate) {
					socket.emit(SocketConst.SEND_ICE_CANDIDATE, {
						candidate: e.candidate,
						targetUserId: otherUserId,
					});
				}
			};

			peerConnection.current.ontrack = (event) => {
				if (partnerVideo.current) {
					partnerVideo.current.srcObject = event.streams[0];
				}
			};

			const stream = userVideo.current?.srcObject as MediaStream;
			stream?.getTracks().forEach((track) => {
				peerConnection.current?.addTrack(track, stream);
			});

			const offer = await peerConnection.current.createOffer();

			await peerConnection.current.setLocalDescription(offer);

			socket.emit(SocketConst.SEND_OFFER, {
				offer,
				targetUserId: otherUserId,
			});
		},
		[socket, otherUserId],
	);



*/
