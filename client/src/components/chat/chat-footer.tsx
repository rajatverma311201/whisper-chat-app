import { Input } from "@/components/ui/input";
import { Mic, Plus, Smile } from "lucide-react";

interface ChatFooterProps {}

export const ChatFooter: React.FC<ChatFooterProps> = ({}) => {
	return (
		<div className="flex items-center gap-5 p-4">
			<Smile className="stroke-[2.5px]" size={30} />
			<Plus className="stroke-[2.5px]" size={30} />
			<Input autoFocus />
			<Mic className="stroke-[2.5px]" size={30} />
		</div>
	);
};
