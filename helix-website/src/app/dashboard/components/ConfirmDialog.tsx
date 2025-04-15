import React from 'react';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface ConfirmDialogProps {
    isOpen: boolean;
    onConfirm: () => void;
    onCancel: () => void;
    title: string;
    description: string;
    confirmText?: string;
    cancelText?: string;
}

export function ConfirmDialog({
    isOpen,
    onConfirm,
    onCancel,
    title,
    description,
    confirmText = "Continue",
    cancelText = "Cancel"
}: ConfirmDialogProps) {
    return (
        <AlertDialog open={isOpen}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{title}</AlertDialogTitle>
                    <AlertDialogDescription>
                        {description}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel onClick={onCancel}>
                        {cancelText}
                    </AlertDialogCancel>
                    <AlertDialogAction onClick={onConfirm}>
                        {confirmText}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
} 