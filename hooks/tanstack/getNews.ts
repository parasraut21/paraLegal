import { getNews } from "@/actions/news";
import { useQuery } from "@tanstack/react-query";

// Create a custom hook to use the query
export default function useGetNews() {
  return useQuery({
    queryKey: ["news"],
    queryFn: async () => {
      return await getNews();
    },
    staleTime: 24 * 60 * 60 * 1000,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
}
