import { Trash, Save, CheckCircle2 } from "lucide-react";
import { Query } from "@/app/api";

interface QueryIconProps {
    query: Query;
    selectedQuery: Query | null;
    hasUnsavedChanges: boolean;
    deletedQueries: Set<string>;
    originalQueries: Query[];
}

export const QueryIcon = ({ query, selectedQuery, hasUnsavedChanges, deletedQueries, originalQueries }: QueryIconProps) => {
    if (deletedQueries.has(query.id)) {
        return <Trash className="w-5 h-5 flex-shrink-0 text-red-500" />;
    }

    const isSelected = selectedQuery?.id === query.id;
    if (isSelected && hasUnsavedChanges) {
        return <Save className="w-5 h-5 flex-shrink-0 text-red-700" />;
    }

    const originalQuery = originalQueries.find(q => q.id === query.id);
    const hasChanges = !originalQuery || JSON.stringify(query) !== JSON.stringify(originalQuery);
    if (hasChanges) {
        return <Save className="w-5 h-5 flex-shrink-0 text-orange-300" />;
    }

    return <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-green-500" />;
};

export default QueryIcon; 