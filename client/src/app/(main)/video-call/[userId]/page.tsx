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
	const { action } = searchParams;

	const { currentUser } = useAuthUser();
	const { socket } = useSocket();

	const [isReceivingCall, setIsReceivingCall] = useState<boolean>(false);
	const [isCallActive, setIsCallActive] = useState<boolean>(false);

	const mediaStreamRef = useRef<MediaStream | null>(null);
	const userVideo = useRef<HTMLVideoElement | null>(null);
	const partnerVideo = useRef<HTMLVideoElement | null>(null);
	const peerConnection = useRef<RTCPeerConnection | null>(null);

	const router = useRouter();

	const otherUserId = userId;
	const currentUserId = currentUser?._id;

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
			}, 2000);
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
			if (userVideo.current) {
				userVideo.current.srcObject = stream;
			}
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

	const handleIceCandidate = (candidate: RTCIceCandidateInit) => {
		peerConnection.current?.addIceCandidate(new RTCIceCandidate(candidate));
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
				<video ref={userVideo} autoPlay muted />
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
