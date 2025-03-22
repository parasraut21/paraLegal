"use client";

import { Thread } from "@/components/ui/thread";
import { ThreadList } from "@/components/ui/thread-list";
import { AssistantRuntimeProvider, WebSpeechSynthesisAdapter } from "@assistant-ui/react";
import { useChatRuntime } from "@assistant-ui/react-ai-sdk";


export const EmotionalSupportAssistant = () => {
  const runtime = useChatRuntime({
    api: "/api/chat/support",
    adapters: {
      speech: new WebSpeechSynthesisAdapter(),
    },
  });

  return (
    <AssistantRuntimeProvider runtime={runtime}>
      <div className="h-[calc(100vh-6rem)] gap-x-2 px-4 py-4">
        <Thread />
      </div>
    </AssistantRuntimeProvider>
  );
};
