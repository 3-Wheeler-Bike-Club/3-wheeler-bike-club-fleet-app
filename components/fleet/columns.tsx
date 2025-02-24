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
        accessorKey: "invoice",
        header: "Invoice No."
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
            const status = statusCodes[statusCode as keyof typeof statusCodes]
            const order = row.original
            return (
                <div>
                    {
                        statusCode === 2 ? (
                            <div>
                                {status} {order.ownerPinkSlipAttestationID.length + "/" + order.amount }
                            </div>
                        ) : (
                            <div>
                                {status}
                            </div>
                        )
                    }
                </div>
            )
        },
    },
]