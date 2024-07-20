"use client";
import { getPersonalChatsKey } from "@/lib/keys";
import { getAllMyPersonalChats } from "@/services/api-chats";
import { useQuery } from "@tanstack/react-query";

export const usePersonalChats = () => {
	const {
		data: personalChats,
		isLoading: isLoadingPersonalChats,
		isFetching: isFetchingPersonalChats,
		error,
	} = useQuery({
		queryKey: getPersonalChatsKey(),
		queryFn: getAllMyPersonalChats,
	});

	return {
		personalChats,
		isFetchingPersonalChats,
		isLoadingPersonalChats,
		error,
	};
};
