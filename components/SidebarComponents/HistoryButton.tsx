import React from "react";
import { History } from "lucide-react";
import { useRouter } from "next/navigation";

const HistoryButton = () => {
  const router = useRouter();

  const handleRedirectHistory = () => {
    router.push(`/feature/fd7c-45c0-97bb-ddb3-4b0d-9ade-91173a`);
  };

  return (
    <div className="w-full mb-5">
      <div
        onClick={handleRedirectHistory}
        className="flex items-center justify-between px-4 py-3 rounded-full cursor-pointer transition hover:bg-gray-200 dark:hover:bg-[#1C1C1C] text-gray-700 dark:text-gray-400"
      >
        <div className="flex items-center">
          <History size={18} className="mr-2" />
          <span className="dark:text-white">History</span>
        </div>
      </div>
    </div>
  );
};

export default HistoryButton;