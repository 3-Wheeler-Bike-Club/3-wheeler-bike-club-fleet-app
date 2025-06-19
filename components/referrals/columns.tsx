import { ColumnDef } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import { useRouter } from "next/navigation";


type Referral = {
    invoice: string;
    amount: string;
    tender: string;
    status: string;
}

export const Columns: ColumnDef<Referral>[] = [
    {
        accessorKey: "referral",
        header: "Referral"
    },
    {
        accessorKey: "status",
        header: "Status",
    },
    {
        accessorKey: "shares",
        header: "Shares",
    },
    {
        id: "actions",
        enableHiding: false,
        cell: ({ row }) => {
            return <ActionCell order={row.original} />;
        },
    },
]

function ActionCell({ order }: { order: Referral }) {
    const router = useRouter();
    
    return (
        <></>
    );
}