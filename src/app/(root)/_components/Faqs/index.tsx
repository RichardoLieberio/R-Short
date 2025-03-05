import { JSX } from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@components/shadcn/accordion';
import { faqs } from './data';
import { faqsType } from './types';

export default async function Faqs(): Promise<JSX.Element> {
    return (
        <Accordion type="single" collapsible className="w-full">
            {
                faqs.map(({ question, answer }: faqsType, index: number) => (
                    <AccordionItem key={`item-${index}`} value={`item-${index}`}>
                        <AccordionTrigger>{question}</AccordionTrigger>
                        <AccordionContent>{answer}</AccordionContent>
                    </AccordionItem>
                ))
            }
        </Accordion>
    );
}
