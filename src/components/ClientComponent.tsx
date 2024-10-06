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
    <VoiceProvider configId={process.env.NEXT_PUBLIC_HUME_CONFIG_ID} auth={{ type: "accessToken", value: accessToken }}>
      <Messages />
      <Controls />
    </VoiceProvider>
  );
}
