import { fleetOrderBookAbi } from "@/utils/abis/fleetOrderBook";
import { publicClient } from "@/utils/client";
import { fleetOrderBook } from "@/utils/constants/addresses";
import { useEffect, useState } from "react";
import { useBlockNumber } from "wagmi";

export const useGetInvites = (address: `0x${string}` | undefined) => {
    const [invites, setInvites] = useState<any[] | undefined>(undefined);

    const { data: blockNumber } = useBlockNumber({ watch: true }) 
    
    async function fetchWhitelistedLogs() {
        if(address){
            const invites = await publicClient.getLogs({
                address: fleetOrderBook,
                event: fleetOrderBookAbi[52],
                args: {
                    referrer: address,
                },
                fromBlock: BigInt(38178483), 
                toBlock: 'latest'
            })
            return invites
        }
    }

    useEffect(() => {
        async function sortLogs() {
            const inviteLogs = await fetchWhitelistedLogs()
            if (inviteLogs) {
                const sortedLogs = inviteLogs.sort((a, b) => {
                    return Number(a.blockNumber) - Number(b.blockNumber);
                });
                setInvites(sortedLogs)
            }
        }
        sortLogs()
    }, [address, blockNumber])

    return { invites }
}