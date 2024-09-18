import React, { useState, useContext, useEffect } from "react";
import { Context } from "../context";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";

// Import ChatEngine components dynamically
const ChatEngine = dynamic(() =>
  import('react-chat-engine').then((module) => module.ChatEngine)
);
const MessageFormSocial = dynamic(() =>
  import('react-chat-engine').then((module) => module.MessageFormSocial)
);

export default function Chats() {
  const { username, secret } = useContext(Context);
  const [ShowChat, setShowChat] = useState(false);
  const router = useRouter();

  // This effect ensures the ChatEngine renders when the document is available
  useEffect(() => {
    if (typeof document !== null) {
      setShowChat(true);
    }
  }, []);

  // Redirect to the home page if username or secret is missing
  useEffect(() => {
    if (username.length === 0 || secret.length === 0) router.push("/");
  }, [username, secret, router]);

  // This effect dynamically adds the Botpress chatbot script tags
  useEffect(() => {
    const script1 = document.createElement("script");
    script1.src = "https://cdn.botpress.cloud/webchat/v2.1/inject.js";
    script1.async = true;

    const script2 = document.createElement("script");
    script2.src = "https://mediafiles.botpress.cloud/6fe55bcb-faf7-4540-96f9-0cd4a5b7d00d/webchat/v2.1/config.js";
    script2.async = true;

    document.body.appendChild(script1);
    document.body.appendChild(script2);

    return () => {
      document.body.removeChild(script1);
      document.body.removeChild(script2);
    };
  }, []);

  // Render nothing if chat is not ready
  if (!ShowChat) return <div />;

  return (
    <div className="background">
      <div className="shadow">
        <ChatEngine
          height="calc(80vh)"
          projectID="e61a2f5b-5891-4798-b310-166178ac4373"
          userName={username}
          userSecret={secret}
          renderNewMessageForm={() => <MessageFormSocial />}
        />
      </div>
    </div>
  );
}
