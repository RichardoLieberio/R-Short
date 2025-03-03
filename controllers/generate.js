import { v4 as uuidv4 } from 'uuid';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { GoogleGenerativeAI } from '@google/generative-ai';
import textToSpeech from '@google-cloud/text-to-speech';
import { AssemblyAI } from 'assemblyai';
import Replicate from 'replicate';
import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';
import { db, User, Video } from '../database/index.js';
import { eq, and, sql } from 'drizzle-orm';

const firebaseConfig = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.FIREBASE_APP_ID,
    measurementId: process.env.FIREBASE_MEASUREMENT_ID,
};

export async function generate({ userId, insertedId, style, duration, storyboard }) {
    try {
        const uuid = uuidv4();
        const prompt = `Write a script and AI image prompt in ${style.toLowerCase()} format for each scene to generate a ${duration} second video based on the following storyboard:\n\n\"\"\"\n${storyboard}\n\"\"\"\n\nThe output should be provided in JSON format with imagePrompt and contentText as fields.`;

        const contents = await generateContent(prompt);
        const result = await Promise.all([ generateTranscript(uuid, contents), generateImages(uuid, contents) ])
            .then(([ transcripts, images ]) => {
                const audioUris = [];
                const imageUris = [];
                const captions = [];

                for (let i = 0; i < contents.length; i ++) {
                    audioUris.push(transcripts[i].audio_url);
                    imageUris.push(images[i]);
                    captions.push(transcripts[i].words);
                }

                return { audio_uri: JSON.stringify(audioUris), image_uri: JSON.stringify(imageUris), captions: JSON.stringify(captions) };
            });

        const newData = { folder: uuid, ...result, status: 'created' };
        await db.update(Video).set(newData).where(eq(Video.id, insertedId));
        return newData;
    } catch (error) {
        console.error(error);
        await db.transaction(async (tx) => {
            await Promise.all([
                tx.update(Video).set({ status: 'failed' }).where(eq(Video.id, insertedId)),
                tx.update(User).set({ coin: sql`${User.coin} + 1` }).where(and(eq(User.id, userId), eq(User.role, 'user'))),
            ]);
        });
    }
}

async function generateContent(prompt) {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    const generationConfig = {
        temperature: 1,
        topP: 0.95,
        topK: 40,
        maxOutputTokens: 8192,
        responseMimeType: 'application/json',
    };

    const chatSession = model.startChat({
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

    const response = await chatSession.sendMessage(prompt);
    const result = response.response.text();
    const contents = JSON.parse(result);

    if (Array.isArray(contents)) {
        if (contents.every((content) => content.hasOwnProperty('imagePrompt') && content.hasOwnProperty('contentText'))) return contents;
    }

    throw new Error('Incorrect content format');
}

async function generateTranscript(id, contents) {
    const textToSpeechClient = new textToSpeech.TextToSpeechClient({ apiKey: process.env.FIREBASE_API_KEY });
    const assemblyClient = new AssemblyAI({ apiKey: process.env.ASSEMBLY_AI_API_KEY });

    const result = await Promise.all(contents.map(async ({ contentText }, index) => {
        const request = {
            input: { text: contentText },
            voice: { languageCode: 'en-US', ssmlGender: 'NEUTRAL' },
            audioConfig: { audioEncoding: 'MP3' },
        };

        const [ audioResponse ] = await textToSpeechClient.synthesizeSpeech(request);
        const audioBuffer = audioResponse.audioContent instanceof Uint8Array ? audioResponse.audioContent : null;

        if (!audioBuffer) throw new Error('Failed to generate audio');

        const app = initializeApp(firebaseConfig);
        const storage = getStorage(app);

        const audioRef = ref(storage, `${id}/Audio/${index + 1}.mp3`);
        if (audioBuffer) await uploadBytes(audioRef, audioBuffer);

        const audioUrl = await getDownloadURL(audioRef);

        const assemblyConfig = { audio_url: audioUrl };
        const transcript = await assemblyClient.transcripts.transcribe(assemblyConfig);

        return transcript;
    }));

    return result;
}

async function generateImages(id, contents) {
    const replicate = new Replicate({ auth: process.env.REPLICATE_API_TOKEN, useFileOutput: false });

    const result = await Promise.all(contents.map(async ({ imagePrompt }, index) => {
        const input = {
            width: 800,
            height: 1200,
            prompt: imagePrompt,
            negative_prompt: 'worst quality, low quality',
            scheduler: 'K_EULER',
            num_outputs: 1,
            guidance_scale: 0,
            num_inference_steps: 4,
        };

        const [ object ] = await replicate.run('bytedance/sdxl-lightning-4step:5599ed30703defd1d160a25a63321b4dec97101d98b4674bcc56e41f62f35637', { input });

        const app = initializeApp(firebaseConfig);
        const storage = getStorage(app);
        const imageRef = ref(storage, `${id}/Image/${index + 1}.png`);

        if (object) {
            const response = await fetch(object);
            if (!response.ok) throw new Error('Failed to fetch generated image');

            const blob = await response.blob();
            await uploadBytes(imageRef, blob);
        }

        const imageUri = await getDownloadURL(imageRef);

        return imageUri;
    }));

    return result;
}
