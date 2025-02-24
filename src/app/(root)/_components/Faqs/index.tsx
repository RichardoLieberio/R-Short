import { JSX } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@components/shadcn/accordion';

export default async function Faqs(): Promise<JSX.Element> {
    const faqs: { question: string, answer: string }[] = [
        {
            question:' What is this AI short video generator, and how does it work?',
            answer: 'Our AI-powered tool creates high-quality short videos in seconds. Simply enter a topic, choose a style, and let AI generate a complete video with animations, scripts, and voiceovers.',
        },
        {
            question: 'Is video generation free?',
            answer: 'Each video generation costs 1 coin. New users receive 2 free coins upon signing up',
        },
        {
            question: 'Can I customize the video style?',
            answer: 'Yes! We offer multiple video styles, allowing you to personalize your videos to suit your needs.',
        },
        {
            question: 'Does the AI automatically add captions?',
            answer: 'Yes, our AI can generate automatic subtitles and captions to enhance accessibility and engagement.',
        },
        {
            question: 'Will the generated videos contain watermarks?',
            answer: 'No, all AI-generated videos are watermark-free, ensuring a clean and professional look.',
        },
        {
            question: 'What payment methods are accepted?',
            answer: 'We accept credit/debit cards and local Indonesian bank payment options.',
        },
    ];
    return (
        <Accordion type="single" collapsible className="w-full">
            {
                faqs.map(({ question, answer }: { question: string, answer: string }, index: number) => (
                    <AccordionItem key={uuidv4()} value={`item-${index}`}>
                        <AccordionTrigger>{question}</AccordionTrigger>
                        <AccordionContent>{answer}</AccordionContent>
                    </AccordionItem>
                ))
            }
        </Accordion>
    );
}
