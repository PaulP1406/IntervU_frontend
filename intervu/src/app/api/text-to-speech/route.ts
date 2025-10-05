import { NextRequest, NextResponse } from "next/server";
import {
    INTERVIEWER_VOICE,
    VOICE_SETTINGS,
    TTS_MODEL_ID,
} from "@/lib/constants";

export async function POST(request: NextRequest) {
    try {
        const { text, voiceId } = await request.json();

        if (!text) {
            return NextResponse.json(
                { success: false, error: "No text provided" },
                { status: 400 }
            );
        }

        const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;
        const VOICE_ID =
            voiceId || process.env.ELEVENLABS_VOICE_ID || INTERVIEWER_VOICE;

        if (!ELEVENLABS_API_KEY) {
            return NextResponse.json(
                { success: false, error: "ElevenLabs API key not configured" },
                { status: 500 }
            );
        }

        // Call ElevenLabs API
        const response = await fetch(
            `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`,
            {
                method: "POST",
                headers: {
                    Accept: "audio/mpeg",
                    "Content-Type": "application/json",
                    "xi-api-key": ELEVENLABS_API_KEY,
                },
                body: JSON.stringify({
                    text: text,
                    model_id: TTS_MODEL_ID,
                    voice_settings: VOICE_SETTINGS,
                }),
            }
        );

        if (!response.ok) {
            const errorText = await response.text();
            console.error("ElevenLabs API error:", errorText);
            return NextResponse.json(
                { success: false, error: "Failed to generate speech" },
                { status: response.status }
            );
        }

        // Get audio data as buffer
        const audioBuffer = await response.arrayBuffer();

        // Return audio as response
        return new NextResponse(audioBuffer, {
            headers: {
                "Content-Type": "audio/mpeg",
                "Content-Length": audioBuffer.byteLength.toString(),
            },
        });
    } catch (error) {
        console.error("Error in text-to-speech API:", error);
        return NextResponse.json(
            { success: false, error: "Internal server error" },
            { status: 500 }
        );
    }
}
