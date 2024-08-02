"use client";
import { ChatDetailsSheet } from "@/components/chat/chat-details-sheet";
import { ChatView } from "@/components/chat/chat-view";
import { SidebarView } from "@/components/sidebar/sidebar-view";
import {
	ResizableHandle,
	ResizablePanel,
	ResizablePanelGroup,
} from "@/components/ui/resizable";
import { useLogout } from "@/hooks/auth/use-logout";

export default function Home() {
	const logout = useLogout();

	return (
		<main className="flex h-screen w-full flex-col items-center justify-between">
			<ResizablePanelGroup direction="horizontal" className="h-full">
				<ResizablePanel defaultSize={30} minSize={20} maxSize={35}>
					<SidebarView />
				</ResizablePanel>
				<ResizableHandle />
				<ResizablePanel defaultSize={70}>
					<ChatView />
					<ChatDetailsSheet />
				</ResizablePanel>
			</ResizablePanelGroup>
		</main>
	);
}
