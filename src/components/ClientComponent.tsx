// ./components/ClientComponent.tsx
"use client";
import { VoiceProvider } from "@humeai/voice-react";
import Messages from "./Messages";
import Controls from "./Controls";

export default function ClientComponent({
  accessToken,
}: {
  accessToken: string;
}) {
  return (
    <VoiceProvider configId={"0ea173e1-6531-4b37-b43e-9d6409ef29ee"} auth={{ type: "accessToken", value: accessToken }}>
      <Messages />
      <Controls />
    </VoiceProvider>
  );
}
