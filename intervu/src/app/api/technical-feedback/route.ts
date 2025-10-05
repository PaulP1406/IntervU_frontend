import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'https://stormhacks-be.onrender.com';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        
        console.log('📤 [Technical Feedback] Sending request to backend:', {
            sessionId: body.sessionId,
            questionId: body.questionId,
            hintsUsed: body.hintsUsed,
            isCompleted: body.isCompleted,
            timeTaken: body.timeTaken,
            codeLength: body.userCode?.length,
        });

        const backendUrl = `${BACKEND_URL}/api/technical-feedback`;
        console.log('🔗 [Technical Feedback] Backend URL:', backendUrl);

        // Create an AbortController with 30 second timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 30000);

        try {
            const response = await fetch(backendUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(body),
                signal: controller.signal,
            });

            clearTimeout(timeoutId);

            const responseText = await response.text();
            console.log('📥 [Technical Feedback] Backend response status:', response.status);
            console.log('📥 [Technical Feedback] Backend response:', responseText.substring(0, 500));

            if (!response.ok) {
                console.error('❌ [Technical Feedback] Backend error:', response.status, responseText);
                
                // Check if it's a 502/503 (backend down or restarting)
                if (response.status === 502 || response.status === 503) {
                    return NextResponse.json(
                        { 
                            error: 'Backend server is currently unavailable', 
                            details: 'The backend server might be starting up or experiencing issues. Please try again in a moment.',
                            status: response.status 
                        },
                        { status: 503 }
                    );
                }
                
                return NextResponse.json(
                    { 
                        error: 'Failed to generate technical feedback', 
                        details: responseText || 'No error details provided',
                        status: response.status 
                    },
                    { status: response.status }
                );
            }

            const data = JSON.parse(responseText);
            console.log('✅ [Technical Feedback] Success:', {
                sessionId: data.sessionId,
                hireAbilityScore: data.hireAbilityScore,
                strengthsCount: data.strengths?.length,
                suggestionsCount: data.suggestions?.length,
            });

            return NextResponse.json(data);
        } catch (fetchError) {
            clearTimeout(timeoutId);
            
            if (fetchError instanceof Error && fetchError.name === 'AbortError') {
                console.error('❌ [Technical Feedback] Request timeout');
                return NextResponse.json(
                    { 
                        error: 'Request timeout', 
                        details: 'The backend took too long to respond. Please try again.' 
                    },
                    { status: 504 }
                );
            }
            throw fetchError;
        }
    } catch (error) {
        console.error('❌ [Technical Feedback] Error:', error);
        return NextResponse.json(
            { 
                error: 'Internal server error', 
                details: error instanceof Error ? error.message : 'Unknown error' 
            },
            { status: 500 }
        );
    }
}
