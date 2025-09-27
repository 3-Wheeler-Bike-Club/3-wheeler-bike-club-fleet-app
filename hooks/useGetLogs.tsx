import { fleetOrderBookAbi } from '@/utils/abis/fleetOrderBook';
import { publicClient } from '@/utils/client'
import { useEffect, useState } from "react";
import { fleetOrderBook } from '@/utils/constants/addresses';
import { useBlockNumber } from 'wagmi';



export const useGetLogs = (address: `0x${string}` | undefined) => {
    const [logs, setLogs] = useState<any[] | undefined>(undefined);

    const { data: blockNumber } = useBlockNumber({ watch: true }) 
    
    async function fetchFractionsLogs() {
        if (address) {
            const eventLogs = await publicClient.getLogs({
                address: fleetOrderBook,
                event: fleetOrderBookAbi[40],
                args: {
                    buyer: address,
                },
                fromBlock: BigInt(40158362), 
                toBlock: 'latest'
            })   
            return eventLogs
        }
    }
    async function fetchFractionsOverflowLogs() {
        if (address) {
            const eventLogs = await publicClient.getLogs({
                address: fleetOrderBook,
                event: fleetOrderBookAbi[41],
                args: {
                    buyer: address,
                },
                fromBlock: BigInt(40158362), 
                toBlock: 'latest'
            })   
            return eventLogs
        }
    }
    async function fetchFullLogs() {
        if (address) {
            const eventLogs = await publicClient.getLogs({
                address: fleetOrderBook,
                event: fleetOrderBookAbi[44],
                args: {
                    buyer: address,
                },
                fromBlock: BigInt(40158362), 
                toBlock: 'latest'
            })
            return eventLogs
        }
    }
    useEffect(() => {
        async function sortLogs() {
            const fractionsLogs = await fetchFractionsLogs()
            const fractionsOverflowLogs = await fetchFractionsOverflowLogs()
            const fullLogs = await fetchFullLogs()
            if (fractionsLogs && fractionsOverflowLogs && fullLogs) {
                const combinedLogs = [...fractionsLogs, ...fractionsOverflowLogs, ...fullLogs];
                const sortedLogs = combinedLogs.sort((a, b) => {
                    return Number(b.blockNumber) - Number(a.blockNumber);
                });
                setLogs(sortedLogs);
            }
        }
        sortLogs()
    }, [address, blockNumber]);

    return { logs };
};
