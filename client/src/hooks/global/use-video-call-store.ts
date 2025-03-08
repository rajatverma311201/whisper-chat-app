import { create } from "zustand";

// Define types for WebRTC signaling data
type RTCSignalData = RTCSessionDescriptionInit | null;
type IceCandidate = RTCIceCandidate | null;

// State interface
interface VideoCallState {
	isCallActive: boolean;
	isReceivingCall: boolean;
	isCallRejected: boolean;
	callerId: string | null;
	recipientId: string | null;
	roomId: string | null;
	callerSignal: RTCSignalData;
	recipientSignal: RTCSignalData;
	localDescription: RTCSignalData;
	remoteDescription: RTCSignalData;
	iceCandidates: IceCandidate[];
	setCallActive: (active: boolean) => void;
	setReceivingCall: (receiving: boolean, callerId?: string) => void;
	setCallRejected: (rejected: boolean) => void;
	setParticipants: (
		callerId: string | null,
		recipientId: string | null,
	) => void;
	setRoomId: (roomId: string | null) => void;
	setCallerSignal: (signal: RTCSignalData) => void;
	setRecipientSignal: (signal: RTCSignalData) => void;
	setLocalDescription: (description: RTCSignalData) => void;
	setRemoteDescription: (description: RTCSignalData) => void;
	addIceCandidate: (candidate: IceCandidate) => void;
	resetCallState: () => void;
}

// Initial state values
const initialState = {
	isCallActive: false,
	isReceivingCall: false,
	isCallRejected: false,
	callerId: null,
	recipientId: null,
	roomId: null,
	callerSignal: null,
	recipientSignal: null,
	localDescription: null,
	remoteDescription: null,
	iceCandidates: [],
};

// Create the Zustand store
export const useVideoCallStore = create<VideoCallState>((set) => ({
	...initialState,

	setCallActive: (active) => set({ isCallActive: active }),

	setReceivingCall: (receiving, callerId) =>
		set((state) => ({
			isReceivingCall: receiving,
			callerId: receiving ? (callerId ?? state.callerId) : state.callerId,
		})),

	setCallRejected: (rejected) => set({ isCallRejected: rejected }),

	setParticipants: (callerId, recipientId) => set({ callerId, recipientId }),

	setRoomId: (roomId) => set({ roomId }),

	setCallerSignal: (signal) => set({ callerSignal: signal }),

	setRecipientSignal: (signal) => set({ recipientSignal: signal }),
	setLocalDescription: (description) =>
		set({ localDescription: description }),

	setRemoteDescription: (description) =>
		set({ remoteDescription: description }),

	addIceCandidate: (candidate) =>
		set((state) => ({
			iceCandidates: candidate
				? [...state.iceCandidates, candidate]
				: state.iceCandidates,
		})),

	resetCallState: () => set({ ...initialState }),
}));
