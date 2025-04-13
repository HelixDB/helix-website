import { Button } from "@/components/ui/button";

export interface PopupState {
    type: 'save' | 'recover';
    queryId?: string;
    action: 'push' | 'switch' | 'new';
    onConfirm: () => void;
    onCancel: () => void;
}

interface ConfirmationPopupProps {
    popup: PopupState;
    onCancel: () => void;
    onConfirm: () => void;
}

export const ConfirmationPopup = ({ popup, onCancel, onConfirm }: ConfirmationPopupProps) => (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-background border rounded-2xl shadow-lg p-6 max-w-md w-full mx-4 popup-content">
            <h3 className="text-lg font-semibold mb-4">
                {popup.type === 'save' ? 'Unsaved Changes' : 'Recover Query'}
            </h3>
            <p className="mb-6 text-muted-foreground">
                {popup.type === 'save' ? (
                    popup.action === 'push' ?
                        "You have unsaved changes. Would you like to save them before pushing?" :
                        popup.action === 'switch' ?
                            "You have unsaved changes. Would you like to save them before switching queries?" :
                            "You have unsaved changes. Would you like to save them before creating a new query?"
                ) : (
                    "Would you like to recover this query?"
                )}
            </p>
            <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={onCancel}>
                    {popup.type === 'save' ?
                        (popup.action === 'push' ? "Push Without Saving" : "Continue Without Saving") :
                        "Cancel"
                    }
                </Button>
                <Button onClick={onConfirm}>
                    {popup.type === 'save' ? "Save and Continue" : "Recover"}
                </Button>
            </div>
        </div>
    </div>
);

export default ConfirmationPopup; 