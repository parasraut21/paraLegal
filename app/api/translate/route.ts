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

// Helper function to split text into chunks of maximum size
function splitTextIntoChunks(text: string, maxLength: number = 190): string[] {
  const chunks: string[] = [];
  
  // Try to split at sentence boundaries first
  const sentences = text.split(/(?<=[.!?])\s+/);
  let currentChunk = '';
  
  for (const sentence of sentences) {
    // If a single sentence is too long, we'll need to split it further
    if (sentence.length > maxLength) {
      // If we have accumulated text, add it as a chunk first
      if (currentChunk) {
        chunks.push(currentChunk);
        currentChunk = '';
      }
      
      // Split long sentence by words
      let words = sentence.split(/\s+/);
      let tempChunk = '';
      
      for (const word of words) {
        if ((tempChunk + ' ' + word).length <= maxLength) {
          tempChunk = tempChunk ? tempChunk + ' ' + word : word;
        } else {
          if (tempChunk) chunks.push(tempChunk);
          tempChunk = word;
        }
      }
      
      if (tempChunk) {
        currentChunk = tempChunk;
      }
    } else if ((currentChunk + ' ' + sentence).length <= maxLength) {
      // Add to current chunk if it fits
      currentChunk = currentChunk ? currentChunk + ' ' + sentence : sentence;
    } else {
      // Start a new chunk
      chunks.push(currentChunk);
      currentChunk = sentence;
    }
  }
  
  // Add the last chunk if there's anything left
  if (currentChunk) {
    chunks.push(currentChunk);
  }
  
  return chunks;
}

export async function POST(request: Request) {
  try {
    console.log('Processing translation request');

    // Extract query parameters
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

    // Translate the provided text using batch
    const translationResult = await translate(inputText, { 
      to: targetLanguage, 
      forceBatch: true 
    });
    
    const translatedText = getTranslatedText(translationResult);

    // Optionally generate speech (TTS) from the translated text
    let audioBase64 = '';
    if (doTTS && translatedText) {
      try {
        // If text is short, use speak directly
        if (translatedText.length <= 190) {  // Using 190 to be safe
          audioBase64 = await speak(translatedText, { to: targetLanguage });
        } else {
          // For longer text, split into chunks and speak each chunk
          const textChunks = splitTextIntoChunks(translatedText);
          
          // Process each chunk with speak function
          const audioChunksPromises = textChunks.map(chunk => 
            speak(chunk, { to: targetLanguage })
          );
          
          // Wait for all chunks to be processed
          const audioChunks = await Promise.all(audioChunksPromises);
          
          // For now, just use the first chunk's audio
          // Note: Properly combining audio chunks would require additional processing
          audioBase64 = audioChunks[0];
          
          console.log(`Processed ${textChunks.length} audio chunks`);
        }
      } catch (ttsError) {
        console.error('TTS error:', ttsError);
        // Continue without TTS if it fails
      }
    }

    // Prepare the response payload
    const responsePayload: ResponsePayload = {
      status: true,
      message: 'Success',
      translatedText,
      audioBase64: doTTS && audioBase64 ? audioBase64 : undefined,
    };

    return NextResponse.json(responsePayload, { status: 200 });
  } catch (error) {
    console.error('Error processing translation:', error);
    
    const errorMessage = error instanceof Error 
      ? `Translation error: ${error.message}` 
      : 'Unknown translation error';
      
    return NextResponse.json(
      {
        status: false,
        message: errorMessage,
      } as ResponsePayload,
      { status: 500 }
    );
  }
}