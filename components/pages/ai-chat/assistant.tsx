"use client";

import { Thread } from "@/components/ui/thread";
import { AssistantRuntimeProvider, WebSpeechSynthesisAdapter } from "@assistant-ui/react";
import { useChatRuntime } from "@assistant-ui/react-ai-sdk";


export const Assistant = ({user , userName} :{user : any , userName : string}) => {

  const runtime = useChatRuntime({
    api: "/api/chat",
    body:{
      user : user,
      userName : userName
    },
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
