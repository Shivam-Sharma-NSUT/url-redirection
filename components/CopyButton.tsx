'use client';
import { ClipboardCopy } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const CopyButton = ({ content }: { content: string }) => {
    const { toast } = useToast();
    const copyToClipboard = () => {
        navigator.clipboard.writeText(content);
        toast({
            title: 'Copied',
            variant: 'success'
        });
    }
    return (
        <ClipboardCopy onClick={copyToClipboard} />
    )
}

export default CopyButton