"use client";
import { getGroupChatsKey } from "@/lib/keys";
import { getAllMyGroupChats } from "@/services/api-chats";
import { useQuery } from "@tanstack/react-query";

export const useGroupChats = () => {
	const {
		data: groupChats,
		isLoading: isLoadingGroupChats,
		isFetching: isFetchingGroupChats,
		error,
	} = useQuery({
		queryKey: getGroupChatsKey(),
		queryFn: getAllMyGroupChats,
	});

	return {
		groupChats,
		isFetchingGroupChats,
		isLoadingGroupChats,
		error,
	};
};
