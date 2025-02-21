import { useEffect, useRef } from "react";

type Handler = () => void;
export default function useOutsideClick<T extends HTMLElement>(
	handler: Handler,
	listenCapturing = true,
) {
	const ref = useRef<T | null>(null);

	useEffect(
		function () {
			function handleClick(e: MouseEvent) {
				if (ref.current && !ref.current.contains(e.target as Node)) {
					handler();
				}
			}

			document.addEventListener("click", handleClick, listenCapturing);

			return () =>
				document.removeEventListener(
					"click",
					handleClick,
					listenCapturing,
				);
		},
		[handler, listenCapturing],
	);

	return ref;
}
