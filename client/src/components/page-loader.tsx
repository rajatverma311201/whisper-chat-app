import { Loader2 } from "lucide-react";

interface PageLoaderProps {}

export const PageLoader: React.FC<PageLoaderProps> = ({}) => {
	return (
		<>
			<div className="flex h-full w-full animate-spin items-center justify-center">
				<Loader2 className="h-14 w-14 text-primary" />
			</div>
		</>
	);
};
