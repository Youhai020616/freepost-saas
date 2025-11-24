import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner"; // 🔧 添加 toast 通知

interface UpdateSchedulePayload {
  postId: string;
  scheduledTime: string;
}

interface Post {
  id: string;
  content: string;
  scheduledTime: string;
  status: string;
  platform: string;
  color: string;
}

export function useUpdatePostSchedule() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ postId, scheduledTime }: UpdateSchedulePayload) => {
      const response = await fetch(`/api/posts/${postId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ scheduledTime }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to update post schedule");
      }

      return response.json();
    },
    onMutate: async ({ postId, scheduledTime }) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["posts"] });

      // Snapshot the previous value
      const previousPosts = queryClient.getQueryData<Post[]>(["posts"]);

      // Optimistically update to the new value
      queryClient.setQueryData<Post[]>(["posts"], (old) => {
        if (!old) return old;
        return old.map((post) =>
          post.id === postId ? { ...post, scheduledTime } : post
        );
      });

      // Return a context object with the snapshotted value
      return { previousPosts };
    },
    onSuccess: () => {
      // 🔧 添加成功提示
      toast.success("Post schedule updated successfully");
    },
    onError: (err, _variables, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      if (context?.previousPosts) {
        queryClient.setQueryData(["posts"], context.previousPosts);
      }
      
      // 🔧 添加用户友好的错误提示
      const errorMessage = err instanceof Error ? err.message : "Failed to update post schedule";
      toast.error(errorMessage);
    },
    onSettled: () => {
      // Always refetch after error or success to ensure consistency
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });
}
