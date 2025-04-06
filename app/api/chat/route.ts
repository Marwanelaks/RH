import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const { message, model } = await req.json();
  const API_TOKEN = process.env.HUGGING_FACE_API_TOKEN;

  if (!API_TOKEN) {
    return NextResponse.json(
      { error: 'Hugging Face API token not configured' },
      { status: 500 }
    );
  }

  try {
    const response = await fetch(`https://api-inference.huggingface.co/models/facebook/blenderbot-400M-distill`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ inputs: message })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Hugging Face API error:', errorData);
      return NextResponse.json(
        { error: `API request failed: ${errorData.error || errorData.message || 'Unknown error'}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    
    let generatedText;
    if (Array.isArray(data) && data.length > 0) {
      generatedText = data[0].generated_text || data[0].conversation?.generated_responses?.join(' ');
    } else {
      generatedText = data.generated_text || data[0]?.generated_text;
    }

    if (!generatedText) {
      return NextResponse.json(
        { reply: "I received your message but didn't understand the response format." }
      );
    }

    return NextResponse.json({ reply: generatedText });
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}