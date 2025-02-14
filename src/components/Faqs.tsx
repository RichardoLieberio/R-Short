import { JSX } from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@components/shadcn/accordion';

export default function Faqs(): JSX.Element {
    return (
        <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
                <AccordionTrigger>What is this AI short video generator, and how does it work?</AccordionTrigger>
                <AccordionContent>Our AI-powered tool creates high-quality short videos in seconds. Simply enter a topic, choose a style, and let AI generate a complete video with animations, scripts, and voiceovers.</AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
                <AccordionTrigger>Is video generation free?</AccordionTrigger>
                <AccordionContent>Each video generation costs 1 coin. New users receive 3 free coins upon signing up, and we offer additional free coins daily under certain conditions.</AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
                <AccordionTrigger>How can I earn free coins?</AccordionTrigger>
                <AccordionContent>To receive free daily coins, users must generate at least one video on the same day.</AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-5">
                <AccordionTrigger>Can I customize the video style, voiceover, and language?</AccordionTrigger>
                <AccordionContent>Yes! We offer multiple video styles and AI-generated voiceovers, allowing you to personalize your videos to suit your needs. Our AI also supports multiple languages.</AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-5">
                <AccordionTrigger>Does the AI automatically add captions?</AccordionTrigger>
                <AccordionContent>Yes, our AI can generate automatic subtitles and captions to enhance accessibility and engagement.</AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-6">
                <AccordionTrigger>Will the generated videos contain watermarks?</AccordionTrigger>
                <AccordionContent>No, all AI-generated videos are watermark-free, ensuring a clean and professional look.</AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-7">
                <AccordionTrigger>What payment methods are accepted?</AccordionTrigger>
                <AccordionContent>We accept credit/debit cards, PayPal, and local Indonesian bank payment options.</AccordionContent>
            </AccordionItem>
        </Accordion>
    );
}
