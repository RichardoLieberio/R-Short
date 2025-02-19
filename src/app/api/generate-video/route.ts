import { NextResponse } from 'next/server';

import path from 'path';
import fs from 'fs';
import { writeFile } from 'fs/promises';

import { eq } from 'drizzle-orm';
import { auth } from '@clerk/nextjs/server';
import { v4 as uuidv4 } from 'uuid';
import { FirebaseApp, initializeApp } from 'firebase/app';
import { FirebaseStorage, StorageReference, getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { GoogleGenerativeAI, GenerativeModel, ChatSession, GenerateContentResult } from '@google/generative-ai';
import textToSpeech, { protos, TextToSpeechClient } from '@google-cloud/text-to-speech';
import { AssemblyAI, Transcript } from 'assemblyai';

import { db, User } from '@database';

const firebaseConfig: firebaseConfigurationType = {
    apiKey: process.env.FIREBASE_API_KEY!,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN!,
    projectId: process.env.FIREBASE_PROJECT_ID!,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET!,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID!,
    appId: process.env.FIREBASE_APP_ID!,
    measurementId: process.env.FIREBASE_MEASUREMENT_ID!,
};

export async function POST(req: Request): Promise<NextResponse> {
    try {
        const { userId }: { userId: string | null } = await auth();
        if (!userId) throw new Error('You are not authenticated.');

        const user: { id: number, role: 'user' | 'admin', coin: number } | undefined = await db.select({ id: User.id, role: User.role, coin: User.coin })
            .from(User)
            .where(eq(User.clerk_id, userId))
            .limit(1)
            .then((res) => res[0]);
        if (!user) throw new Error('Something went wrong.');

        if (user.role === 'admin' || user.coin > 0) {
            const body: { storyboard: string, style: string, customSyle: string } = await req.json();
            return NextResponse.json({ message: 'Success', body }, { status: 200 });
        }

        throw new Error("You don't have any coins.");

        const id: string = uuidv4();
        const prompt: string = 'Write a script and AI image prompt in {format} format for each scene to generate a 30 second video based on the following storyboard:\n\n\"\"\"\n{storyboard}\n\"\"\"\n\nThe output should be provided in JSON format with imagePrompt and contentText as fields.';

        const contents: ContentType[] = await generateContent(prompt);
        const [ transcripts, images ]: [ Transcript[], string[] ] = await Promise.all([ generateTranscript(id, contents), generateImages(contents) ]);

        return NextResponse.json({ message: 'Success', transcripts, images }, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: 'Failed', error }, { status: 400 });
    }
}

async function generateContent(prompt: string): Promise<ContentType[]> {
    const genAI: GoogleGenerativeAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
    const model: GenerativeModel = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    const generationConfig: GeminiConfigurationType = {
        temperature: 1,
        topP: 0.95,
        topK: 40,
        maxOutputTokens: 8192,
        responseMimeType: 'application/json',
    };

    const chatSession: ChatSession = model.startChat({
        generationConfig,
        history: [
            {
                role: 'user',
                parts: [
                    { text: 'Write a script and AI image prompt in realistic format for each scene to generate a 30 second video based on the following storyboard:\n\n\"\"\"\nA poor young man overcomes various obstacles and rises to become a successful entrepreneur.\n\"\"\"\n\nThe output should be provided in JSON format with imagePrompt and contentText as fields.' },
                ],
            },
            {
                role: 'model',
                parts: [
                    { text: "```json\n[\n  {\n    \"imagePrompt\": \"Ultra realistic, cinematic shot, poor young man, early 20s, tattered clothes, walking down a rain-soaked alley in a rundown city. Overcast sky, puddles reflecting dim streetlights, overflowing garbage cans, feeling defeated and hopeless, long shot, 35mm lens.\",\n    \"contentText\": \"John was just another face in the crowd, lost in the shadows of a city that seemed to have forgotten him.\"\n  },\n  {\n    \"imagePrompt\": \"Close-up, John's hands, calloused and dirty, working on a broken bicycle in a dimly lit garage. Tools scattered around, determined expression on his face, single overhead light, gritty realism, shallow depth of field.\",\n    \"contentText\": \"But beneath the surface of despair, a spark of ingenuity flickered.  He wouldn't give up.\"\n  },\n  {\n    \"imagePrompt\": \"Medium shot, John confidently pitching his bicycle repair service to a skeptical-looking business owner (middle-aged, suit and tie) outside a small business. Sunny day, bustling city street in the background, slight upward angle, focus on John's passionate explanation.\",\n    \"contentText\": \"He started small, offering what he could, pouring his heart into every task.\"\n  },\n  {\n    \"imagePrompt\": \"Time-lapse shot. John working tirelessly in his garage, fixing bicycles. Over several hours (compressed into a few seconds), the light changes from morning to night. Piles of repaired bikes grow larger. Upbeat, determined music playing.\",\n    \"contentText\": \"Hours turned into days, and days into weeks, fueled by unwavering dedication.\"\n  },\n  {\n    \"imagePrompt\": \"Medium shot, John, now wearing cleaner clothes but still practical, standing in front of a small, newly renovated shop with a sign that reads \\\"John's Cycle Repair.\\\" Smiling proudly, wiping sweat from his brow. Natural lighting, vibrant colors, sense of accomplishment.\",\n    \"contentText\": \"His hard work began to pay off. He built a business, brick by brick, from the ground up.\"\n  },\n  {\n    \"imagePrompt\": \"Wide shot, John's Cycle Repair bustling with customers. Mechanics working efficiently, customers smiling, bikes being repaired and sold. John is visible in the background, overseeing the operation with a confident air. Bright and airy atmosphere, positive energy, professional equipment visible.\",\n    \"contentText\": \"His small shop became a hub, a place where people could rely on quality and honest service.\"\n  },\n  {\n    \"imagePrompt\": \"Medium shot, John, now in a business suit, sitting at a large desk in a modern office. Multiple computer screens displaying data and graphs. Confidently signing documents, a satisfied but thoughtful expression on his face. Large window overlooking a city skyline. High-tech, professional environment.\",\n    \"contentText\": \"John's vision expanded beyond simple repairs.\"\n  },\n  {\n    \"imagePrompt\": \"Wide shot, showcasing a modern bicycle factory. Robots assembling bikes, workers in clean uniforms operating machinery. John, wearing a hard hat and safety glasses, observing the process with a team of engineers. Futuristic design, advanced technology, symbol of innovation.\",\n    \"contentText\": \"He innovated, created jobs, and transformed the way people thought about transportation.\"\n  },\n  {\n    \"imagePrompt\": \"Close-up, John shaking hands with a young boy receiving a brand new bicycle. John is smiling warmly, the boy is beaming with joy. Focus on the connection between them. Soft lighting, heartwarming moment, sense of giving back.\",\n    \"contentText\": \"But his success wasn't just about profit. He understood the importance of giving back to the community that had supported him.\"\n  },\n  {\n    \"imagePrompt\": \"Ultra realistic, cinematic shot, John, standing on the rooftop of his company headquarters, overlooking the city skyline at sunset. A confident and content expression on his face. Golden hour lighting, panoramic view, symbol of accomplishment and hope.\",\n    \"contentText\": \"John's story is a testament to the power of perseverance, proving that even from the humblest beginnings, anything is possible.\"\n  }\n]\n```" },
                ],
            },
        ],
    });

    const response: GenerateContentResult = await chatSession.sendMessage(prompt);
    const result: string = response.response.text();
    const contents: ContentType[] = JSON.parse(result);

    if (Array.isArray(contents)) {
        if (contents.every((content) => content.hasOwnProperty('imagePrompt') && content.hasOwnProperty('contentText'))) return contents;
    }

    throw new Error('Incorrect content format');
}

async function generateTranscript(contents: ContentType[]): Promise<Transcript[]> {
    const textToSpeechClient: TextToSpeechClient = new textToSpeech.TextToSpeechClient({ apiKey: process.env.FIREBASE_API_KEY });
    const assemblyClient: AssemblyAI = new AssemblyAI({ apiKey: process.env.ASSEMBLY_AI_API_KEY! });

    const result: Transcript[] = await Promise.all(contents.map(async ({ contentText }: { contentText: string }): Promise<Transcript> => {
        const request: protos.google.cloud.texttospeech.v1.ISynthesizeSpeechRequest = {
            input: { text: contentText },
            voice: { languageCode: 'en-US', ssmlGender: 'NEUTRAL' },
            audioConfig: { audioEncoding: 'MP3' },
        };

        const [ audioResponse ]: audioResponseType = await textToSpeechClient.synthesizeSpeech(request);
        const audioBuffer: Uint8Array | null = audioResponse.audioContent instanceof Uint8Array ? audioResponse.audioContent : null;

        if (!audioBuffer) throw new Error('Failed to generate audio');

        if (process.env.MODE === 'development') {
            const app: FirebaseApp = initializeApp(firebaseConfig);
            const storage: FirebaseStorage = getStorage(app);

            const soundRef: StorageReference = ref(storage, `Sounds/${uuidv4()}.mp3`);
            if (audioBuffer) await uploadBytes(soundRef, audioBuffer);

            const audioUrl: string = await getDownloadURL(soundRef);

            const assemblyConfig: { audio_url: string } = { audio_url: audioUrl };
            const transcript: Transcript = await assemblyClient.transcripts.transcribe(assemblyConfig);

            return transcript;
        } else {
            const fileName: string = uuidv4() + '.mp3';
            const filePath: string = path.join(process.cwd(), 'public', 'temp', 'voices', fileName);

            await fs.promises.mkdir(path.dirname(filePath), { recursive: true });
            await writeFile(filePath, audioBuffer);

            const assemblyConfig: { audio_url: string } = { audio_url: filePath };
            const transcript: Transcript = await assemblyClient.transcripts.transcribe(assemblyConfig);

            return transcript;
        }
    }));

    return result;
}

async function generateImages(contents: ContentType[]): Promise<string[]> {
    // const replicate: Replicate = new Replicate({ auth: process.env.REPLICATE_API_TOKEN, useFileOutput: false });
    // contents = [ contents[0] ];

    // const result: string[] = await Promise.all(contents.map(async ({ imagePrompt }: { imagePrompt: string }): Promise<string> => {
    //     const input: imageInputConfigurationType = {
    //         width: 800,
    //         height: 1200,
    //         prompt: imagePrompt,
    //         negative_prompt: 'worst quality, low quality',
    //         scheduler: 'K_EULER',
    //         num_outputs: 1,
    //         guidance_scale: 0,
    //         num_inference_steps: 4,
    //     };

    //     const [ object ]: string[] = await replicate.run('bytedance/sdxl-lightning-4step:5599ed30703defd1d160a25a63321b4dec97101d98b4674bcc56e41f62f35637', { input }) as string[];

    //     return object;
    // }));

    return ['result'];
}

type firebaseConfigurationType = {
    apiKey: string;
    authDomain: string;
    projectId: string;
    storageBucket: string;
    messagingSenderId: string;
    appId: string;
    measurementId: string;
};

type GeminiConfigurationType = {
    temperature: number;
    topP: number;
    topK: number;
    maxOutputTokens: number;
    responseMimeType: string;
};

type imageInputConfigurationType = {
    width: number;
    height: number;
    prompt: string;
    negative_prompt: string;
    scheduler: string;
    num_outputs: number;
    guidance_scale: number;
    num_inference_steps: number
};

type audioResponseType = [
    protos.google.cloud.texttospeech.v1.ISynthesizeSpeechResponse,
    protos.google.cloud.texttospeech.v1.ISynthesizeSpeechRequest | undefined,
    object | undefined
];

type ContentType = {
    imagePrompt: string;
    contentText: string;
};
