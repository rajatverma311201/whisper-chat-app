import { useSocket } from "@/hooks/global/use-socket";
import { SocketConst } from "@/lib/constants";
import React, { useCallback, useEffect, useRef, useState } from "react";

interface VideoCallProps {
	currentUserId: string;
	otherUserId: string;
}

export const VideoCall: React.FC<VideoCallProps> = ({
	currentUserId,
	otherUserId,
}) => {
	const [isReceivingCall, setIsReceivingCall] = useState<boolean>(false);
	const [isCallActive, setIsCallActive] = useState<boolean>(false);
	const userVideo = useRef<HTMLVideoElement | null>(null);
	const partnerVideo = useRef<HTMLVideoElement | null>(null);
	const peerConnection = useRef<RTCPeerConnection | null>(null);
	const { socket } = useSocket();

	const startCall = useCallback(
		async (peerConnectionData: any) => {
			peerConnection.current = new RTCPeerConnection();

			peerConnection.current.onicecandidate = (e) => {
				if (e.candidate) {
					socket.emit("send-ice-candidate", {
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

			socket.emit("send-offer", {
				offer,
				targetUserId: otherUserId,
			});
		},
		[socket, otherUserId],
	);

	useEffect(() => {
		return;
		// Get user media (video and audio)
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
				socket.on("receive-ice-candidate", handleIceCandidate);

				return () => {
					socket.off("incoming-call");
					socket.off("call-accepted");
					socket.off("receive-ice-candidate");
				};
			})
			.catch((err) => console.log("Error accessing media devices:", err));
	}, [socket, currentUserId, startCall]);

	const handleIceCandidate = (candidate: RTCIceCandidateInit) => {
		peerConnection.current?.addIceCandidate(new RTCIceCandidate(candidate));
	};

	const answerCall = () => {
		socket.emit(SocketConst.PERSONAL_CHAT_ACCEPT_INCOMING_CALL, {
			targetUserId: otherUserId,
		});
		setIsCallActive(true);
	};

	return (
		<div>
			<h2>Video Call</h2>
			{isReceivingCall && (
				<button onClick={answerCall}>Answer Call</button>
			)}
			{isCallActive && (
				<dialog open>
					<video ref={userVideo} autoPlay muted />
					<video ref={partnerVideo} autoPlay />
				</dialog>
			)}
		</div>
	);
};
