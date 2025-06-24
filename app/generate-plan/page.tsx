"use client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { vapi } from "@/lib/vapi";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { Phone, PhoneOff, Loader2Icon } from "lucide-react";

const GenerateProgramPage = () => {
  const [isCallActive, setIsCallActive] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isAiSpeaking, setIsAiSpeaking] = useState(false);
  const [isAiMessage, setIsAiMessage] = useState<any[]>([]);
  const [isCallEnded, setIsCallEnded] = useState(false);

  // get user profile
  const { user } = useUser();
  const router = useRouter();

  const messageContainerRef = useRef<HTMLDivElement>(null);

  // Move handler functions outside useEffect so they can be referenced in both .on and .off
  const handleCallStart = () => {
    setIsConnecting(false);
    setIsCallActive(true);
    setIsCallEnded(false);
  };
  const handleCallEnd = () => {
    setIsCallActive(false);
    setIsConnecting(false);
    setIsAiSpeaking(false);
    setIsCallEnded(true);
  };
  const handleSpeechStart = () => {
    setIsAiSpeaking(true);
  };
  const handleSpeechEnd = () => {
    setIsAiSpeaking(false);
  };
  const handleMessage = (message: any) => {
    if (message.type === "transcript" && message.transcriptType === "final") {
      const newMessage = { content: message.transcript, role: message.role };
      setIsAiMessage((prev) => [...prev, newMessage]);
    }
  };
  const handleError = (error: any) => {
    console.log("error - ", error);
    setIsConnecting(false);
    setIsCallActive(false);
  };

  useEffect(() => {
    // using vapi sdk for different events
    vapi
      .on("call-start", handleCallStart)
      .on("call-end", handleCallEnd)
      .on("speech-start", handleSpeechStart)
      .on("speech-end", handleSpeechEnd)
      .on("message", handleMessage)
      .on("error", handleError);

    // cleanup event listeners on unmount
    return () => {
      vapi.off("call-start", handleCallStart);
      vapi.off("call-end", handleCallEnd);
      vapi.off("speech-start", handleSpeechStart);
      vapi.off("speech-end", handleSpeechEnd);
      vapi.off("message", handleMessage);
      vapi.off("error", handleError);
    };
  }, []);

  // scroll messages
  useEffect(() => {
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTop =
        messageContainerRef.current.scrollHeight;
    }
  }, [isAiMessage]);

  // profile page navigation
  useEffect(() => {
    if (isCallEnded) {
      const redirectTimer = setTimeout(() => {
        router.push("/profile");
      }, 3000);
      return () => clearTimeout(redirectTimer);
    }
  }, [isCallEnded, router]);

  const toggleCall = async () => {
    if (isCallActive) {
      await vapi.stop();
    } else {
      try {
        setIsConnecting(true);
        setIsAiMessage([]);
        setIsCallEnded(false);

        const userId = user?.id;

        const fullName = user?.fullName
          ? `${user.fullName} ${user.lastName || ""}`.trim()
          : "There";

        const assistantOverrides = {
          variableValues: {
            full_name: fullName,
            user_id: userId, // user coming from clerk
          },
        };

        await vapi.start(
          undefined, // no assistant
          assistantOverrides, // pass user_id and full_name to workflow
          undefined, // no squad
          process.env.NEXT_PUBLIC_VAPI_WORKFLOW_ID! // workflow ID
        );
      } catch (error) {
        console.log("error - ", error);
        setIsConnecting(false);
        setIsCallActive(false);
      }
    }
  };

  return (
    <div className="flex flex-col min-h-screen text-foreground overflow-hidden  pb-6 pt-24">
      <div className="container mx-auto px-4 h-full max-w-5xl">
        {/* Title */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold font-mono">
            <span>Generate Your </span>
            <span className="text-primary uppercase">Fitness Program</span>
          </h1>
          <p className="text-muted-foreground mt-2">
            Have a voice conversation with our AI assistant to create your
            personalized plan
          </p>
        </div>

        {/* Call button */}
        <div className="w-full flex justify-center gap-4 pb-4">
          <Button
            className={`w-100 text-xl rounded-4xl text-white relative 
                ${
                  isCallActive
                    ? "bg-destructive hover:bg-destructive/90"
                    : isCallEnded
                      ? "bg-green-600 hover:bg-green-700"
                      : "bg-primary hover:bg-primary/90"
                }`}
            onClick={toggleCall}
            disabled={isConnecting || isCallEnded}
          >
            {isConnecting && (
              <div className="flex items-center gap-2">
                <Loader2Icon className="size-5 animate-spin" />
                <span>Connecting...</span>
              </div>
            )}
            {!isConnecting && (
              <div className="flex items-center gap-2">
                {isCallActive ? (
                  <PhoneOff className="size-5" />
                ) : (
                  <Phone className="size-5" />
                )}
                <span>{isCallActive ? "End Call" : "Start Call"}</span>
              </div>
            )}
          </Button>
        </div>

        {/* Call Area */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* User Card */}
          <Card
            className={`bg-card/90 backdrop-blur-sm border overflow-hidden relative`}
          >
            <div className="aspect-video flex flex-col items-center justify-center p-6 relative">
              {/* User Image */}
              <div className="relative size-32 mb-4">
                <img
                  src={user?.imageUrl}
                  alt="User"
                  // ADD THIS "size-full" class to make it rounded on all images
                  className="size-full object-cover rounded-full"
                />
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                {user
                  ? (user.firstName + " " + (user.lastName || "")).trim()
                  : "Guest"}
              </p>

              {/* User Ready Text */}
              <div
                className={`mt-4 flex items-center gap-2 px-3 py-1 rounded-full bg-card border`}
              >
                <div className={`w-2 h-2 rounded-full bg-muted`} />
                <span className="text-xs text-muted-foreground">Ready</span>
              </div>
            </div>
          </Card>

          {/* AI ASSISTANT CARD */}
          <Card className="bg-card/90 backdrop-blur-sm border border-border overflow-hidden relative">
            <div className="aspect-video flex flex-col items-center justify-center p-6 relative">
              {/* AI VOICE ANIMATION */}
              <div
                className={`absolute inset-0 ${
                  isAiSpeaking ? "opacity-30" : "opacity-0"
                } transition-opacity duration-300`}
              >
                {/* Voice wave animation when speaking */}
                <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 flex justify-center items-center h-20">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className={`mx-1 h-16 w-1 bg-primary rounded-full ${
                        isAiSpeaking ? "animate-sound-wave" : ""
                      }`}
                      style={{
                        animationDelay: `${i * 0.1}s`,
                        height: isAiSpeaking
                          ? `${Math.random() * 50 + 20}%`
                          : "5%",
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* AI IMAGE */}
              <div className="relative size-32 mb-4">
                <div
                  className={`absolute inset-0 bg-primary opacity-10 rounded-full blur-lg ${
                    true ? "animate-ping" : ""
                  }`}
                />
              </div>

              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-foreground">
                  CodeFlex AI
                </h2>
                <span className="text-sm text-muted-foreground">•</span>
                <p className="text-sm text-muted-foreground">
                  Fitness & Diet Coach
                </p>
              </div>

              {/* SPEAKING INDICATOR */}

              <div
                className={`mt-4 flex items-center gap-2 px-3 py-1 rounded-full bg-card border border-border ${
                  isAiSpeaking ? "border-primary" : ""
                }`}
              >
                <div
                  className={`w-2 h-2 rounded-full ${
                    isAiSpeaking ? "bg-primary animate-pulse" : "bg-muted"
                  }`}
                />

                <span className="text-xs text-muted-foreground">
                  {isAiSpeaking
                    ? "Speaking..."
                    : isCallActive
                      ? "Listening..."
                      : isCallEnded
                        ? "Redirecting to profile..."
                        : "Waiting..."}
                </span>
              </div>
            </div>
          </Card>
        </div>

        {/* Message Container */}
        {isAiMessage.length > 0 && (
          <div
            ref={messageContainerRef}
            className="w-full bg-card/90 backdrop-blur-sm border border-border rounded-xl p-4 mb-8 h-64 overflow-y-auto transition-all duration-300 scroll-smooth"
          >
            <div className="space-y-4">
              {isAiMessage.map((message, index) => (
                <div key={index} className="message-item animate-fadeIn">
                  <div className="font-semibold text-xs text-muted-foreground mb-1">
                    {message.role === "assistant" ? "SpotMeBro AI" : "You"}:
                  </div>
                  <p className="text-foreground">{message.content}</p>
                </div>
              ))}

              {isCallEnded && (
                <div className="message-item animate-fadeIn">
                  <div className="font-semibold text-xs text-primary mb-1">
                    System:
                  </div>
                  <p className="text-foreground">
                    Your fitness plan has been created! Redirecting to profile
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GenerateProgramPage;
