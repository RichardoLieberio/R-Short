import { ReactNode, JSX } from 'react';
import { AlertDialogContent as ShadcnAlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@components/shadcn/alert-dialog';

export default function AlertDialogContent({ title, description, footer }: { title: ReactNode, description: ReactNode, footer?: ReactNode }): JSX.Element {
    return (
        <ShadcnAlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle className="flex items-center gap-2">{ title }</AlertDialogTitle>
                <AlertDialogDescription>{ description }</AlertDialogDescription>
            </AlertDialogHeader>
            {
                footer && <AlertDialogFooter>{ footer }</AlertDialogFooter>
            }
        </ShadcnAlertDialogContent>
    );
}
