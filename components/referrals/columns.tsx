import { shortenTxt } from "@/utils/shorten";
import { ColumnDef } from "@tanstack/react-table";
import { useGetBlockTime } from "@/hooks/useGetBlockTime";
import { fleetOrderBook } from "@/utils/constants/addresses";
import { useBlockNumber, useReadContract } from "wagmi";
import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { fleetOrderBookAbi } from "@/utils/abis/fleetOrderBook";
import { CircleCheck, CircleSlash } from "lucide-react";


export const Columns: ColumnDef<any>[] = [
    {
        accessorKey: "referral",
        header: "Referral",
        cell: ({row}) => {
            const address = (row.original.args.owner)
            return <div>{shortenTxt(address as string)}</div>
        },
    },
    {
        id: "blockTime",
        header: "Since",
        enableHiding: false,
        cell: ({ row }) => {
            return <TimeCell blockNumber={row.original.blockNumber} />;
        },
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
            return <StatusCell address={row.original.args.owner} />;
        },
    },
    {
        accessorKey: "shares",
        header: "Shares",
        cell: ({ row }) => {
            return <SharesCell address={row.original.args.owner} />;
        },
    },
    
]



function TimeCell({ blockNumber }: { blockNumber: bigint }) {
    
    const { blockTime } = useGetBlockTime(blockNumber);
    return (    
        <div>{new Date(Number(blockTime) * 1000).toLocaleDateString()}</div>
    );
}

function StatusCell({ address }: { address: string }) {
    
    const compliantQueryClient = useQueryClient()

    const { data: blockNumber } = useBlockNumber({ watch: true })  
    
    const { data: compliant, isLoading: compliantLoading, queryKey: compliantQueryKey } = useReadContract({
        address: fleetOrderBook,
        abi: fleetOrderBookAbi,
        functionName: "isCompliant",
        args: [address as `0x${string}`],
    })
    useEffect(() => { 
        compliantQueryClient.invalidateQueries({ queryKey: compliantQueryKey }) 
    }, [blockNumber, compliantQueryClient, compliantQueryKey]) 

    
    return (
        <div>{compliant ? <CircleCheck className="h-4 w-4 text-green-600" /> : <CircleSlash className="h-4 w-4 text-red-600" />}</div>
    );
}

function SharesCell({ address }: { address: string }) {

    const sharesQueryClient = useQueryClient()

    const { data: blockNumber } = useBlockNumber({ watch: true })  
    
    const { data: shares, isLoading: sharesLoading, queryKey: sharesQueryKey } = useReadContract({
        address: fleetOrderBook,
        abi: fleetOrderBookAbi,
        functionName: "referralPoolShares",
        args: [address as `0x${string}`],
    })
    useEffect(() => {   
        sharesQueryClient.invalidateQueries({ queryKey: sharesQueryKey }) 
    }, [blockNumber, sharesQueryClient, sharesQueryKey]) 
    
    return (
        <div>{Number(shares)}</div>
    );
}