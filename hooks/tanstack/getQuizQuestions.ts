import { useQuery } from "@tanstack/react-query";
import { getOrCreateDailyQuiz } from "../../actions/quiz/index";

// Helper function to get current date string
const getCurrentDateString = () => {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
};

// Create a custom hook to use the query
export default function useQuizQuestions() {
  return useQuery({
    queryKey: ["quiz", getCurrentDateString()],
    queryFn: async () => {
      return await getOrCreateDailyQuiz();
    },
    staleTime: Infinity, // Data never goes stale during the current date
    gcTime: 24 * 60 * 60 * 1000, // Garbage collect the data after 24 hours
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
}
