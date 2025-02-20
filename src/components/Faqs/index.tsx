import { JSX } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { db, Faq } from '@database';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@components/shadcn/accordion';

export default async function Faqs(): Promise<JSX.Element> {
    const faqs: { question: string, answer: string }[] = await db.select({ question: Faq.question, answer: Faq.answer })
        .from(Faq)
        .orderBy(Faq.position);

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
