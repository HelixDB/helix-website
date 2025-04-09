import { CheckCircle2, Save } from "lucide-react";

export const StatusLegend = () => (
    <div className="ml-auto flex items-center gap-6 text-xs sm:text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-green-500" />
            <span>Up to date</span>
        </div>
        <div className="flex items-center gap-2">
            <Save className="w-4 h-4 text-orange-300" />
            <span>Saved, not pushed</span>
        </div>
        <div className="flex items-center gap-2">
            <Save className="w-4 h-4 text-red-700" />
            <span>Unsaved changes</span>
        </div>
    </div>
);

export default StatusLegend; 