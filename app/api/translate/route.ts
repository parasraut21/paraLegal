import { NextResponse } from 'next/server';
import { translate, speak } from 'google-translate-api-x';

interface ResponsePayload {
  translatedText?: string;
  audioBase64?: string;
  status: boolean;
  message: string;
}

// Helper function to safely extract translated text
function getTranslatedText(result: any): string {
  if (Array.isArray(result)) {
    // If it's an array, use the first element
    return result[0]?.text;
  } else if (typeof result === 'object') {
    // If it's a dictionary-like object, you can pick the first key's value.
    if ('text' in result) {
      return result.text;
    }
    const values = Object.values(result);
    if (values.length > 0 && values[0] !== null && typeof values[0] === 'object' && 'text' in values[0]) {
      return (values[0] as { text: string }).text;
    }
  }
  return "";
}

export async function POST(request: Request) {
  try {
    console.log('hello'); // Should print to your server logs

    // Extract query parameters for target language and TTS flag from the request URL
    const url = new URL(request.url);
    const targetLanguage = url.searchParams.get('to') || 'en';
    const doTTS = url.searchParams.get('tts') === 'true';

    // Parse the incoming JSON body
    const body = await request.json();
    const inputText = body.text;
    if (!inputText) {
      return NextResponse.json(
        { status: false, message: 'No text provided.' } as ResponsePayload,
        { status: 400 }
      );
    }

    // Translate the provided text
    const translationResult = await translate(inputText, { to: targetLanguage });
    const translatedText = getTranslatedText(translationResult);

    // Optionally generate speech (TTS) from the translated text
    let audioBase64 = '';
    if (doTTS) {
      audioBase64 = await speak(translatedText, { to: targetLanguage });
    }

    // Prepare the response payload
    const responsePayload: ResponsePayload = {
      status: true,
      message: 'Success',
      translatedText,
      audioBase64: doTTS ? audioBase64 : undefined,
    };

    return NextResponse.json(responsePayload, { status: 200 });
  } catch (error) {
    console.error('Error processing translation:', error);
    return NextResponse.json(
      {
        status: false,
        message: 'Error processing translation.',
      } as ResponsePayload,
      { status: 500 }
    );
  }
}
