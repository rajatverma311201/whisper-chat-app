// import { useSocket } from "@/hooks/global/use-socket";
// import { SocketConst } from "@/lib/constants";
// import React, { useCallback, useEffect, useRef, useState } from "react";

// interface VideoCallProps {
// 	currentUserId: string;
// 	otherUserId: string;
// }

// export const VideoCall: React.FC<VideoCallProps> = ({
// 	currentUserId,
// 	otherUserId,
// }) => {

// 	return (
// 		<div>
// 			<h2>Video Call</h2>
// 			{isReceivingCall && (
// 				<button onClick={answerCall}>Answer Call</button>
// 			)}
// 			{isCallActive && (
// 				<dialog open>
// 					<video ref={userVideo} autoPlay muted />
// 					<video ref={partnerVideo} autoPlay />
// 				</dialog>
// 			)}
// 		</div>
// 	);
// };
