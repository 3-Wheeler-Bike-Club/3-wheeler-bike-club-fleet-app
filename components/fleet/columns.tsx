import { OffchainFleetOrder } from "@/hooks/offchain/useGetFleetOrdersByAddress";
//import { trimRef } from "@/utils/trim";
import { ColumnDef } from "@tanstack/react-table";


export const statusCodes = {
    0: "Order Created",
    1: "Pending Vehicle Registration",
    2: "Pending Driver Assignment",
    3: "Hire Purchase Started",
    99: "Order Refunded"
}
export const Columns: ColumnDef<OffchainFleetOrder>[] = [
    {
        accessorKey: "order",
        header: "Ornder No."
    },
    {
        accessorKey: "amount",
        header: "Amount",
    },
    {
        accessorKey: "tender",
        header: "Pay Method",
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({row}) => {
            const statusCode = (row.getValue("status"))
            return <div>{statusCodes[statusCode as keyof typeof statusCodes]}</div>
        },
    },
]