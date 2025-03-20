"use client"

import { Ellipsis, Minus, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer"
import { useState } from "react"
import { price3WheelerUSD, ready3WheelerDrivers } from "@/utils/constants/misc"
import { Separator } from "@/components/ui/separator"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { usePaystackPayment } from "react-paystack";
import { PaystackProps } from "react-paystack/dist/types"
import { usePrivy } from "@privy-io/react-auth"
import { Country } from "@/utils/constants/countries"
import { Countries } from "@/utils/constants/countries"
import { useGetCurrencyRate } from "@/hooks/currencyRate/useGetCurrencyRate"
import { postFleetOrderAction } from "@/app/actions/offchain/postFleetOrderAction"
import { motion } from "framer-motion"
import { getFleetOrdersAction } from "@/app/actions/offchain/getFleetOrdersAction"

export function Authorized() {
  const [amount, setAmount] = useState(1)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const increase = () => setAmount((prev) => prev + 1);
  const decrease = () => setAmount((prev) => (prev > 0 ? prev - 1 : 1));

  const {user} = usePrivy();

  const smartWallet = user?.linkedAccounts.find((account) => account.type === 'smart_wallet');
  console.log(smartWallet?.address);
  
  const country = Countries[user?.customMetadata?.country as keyof typeof Countries] as Country;
  console.log(country)

  const { currencyRate } = useGetCurrencyRate(country.code)
  console.log(currencyRate)

  const config : PaystackProps = {
    reference: `${(new Date()).getTime().toString()}-3WB-${country.code}-${Math.ceil(amount * Number(currencyRate?.rate) * price3WheelerUSD * 100)}`,
    email: user!.email!.address!,
    amount: Math.ceil(amount * Number(currencyRate?.rate) * price3WheelerUSD * 100), //Amount is in the country's lowest currency. E.g Kobo, so 20000 kobo = N200
    publicKey: process.env.NEXT_PUBLIC_PAYSTACK_KEY,
    currency: currencyRate?.currency,
    channels: ['card', 'mobile_money'],
}
interface referenceTypes {
    reference: string
}
const onSuccess = async (reference: referenceTypes) => {
    // Implementation for whatever you want to do with reference and after success call.
    console.log('reference', reference);
    //logic for the payment success
    const defaultOwnerPinkSlipAttestationIDs =[]
    const defaultOwnerPinkSlipAttestationID =  "0x6x"
    for (let i = 0; i < amount; i++) {
      defaultOwnerPinkSlipAttestationIDs.push(defaultOwnerPinkSlipAttestationID)
    }
    //gen order id
    const genOrderSerialNumber = async() => {
      try {
        const data = await getFleetOrdersAction()
        return `000-${data.length + 1}-${(new Date()).getTime().toString()}-3WB-${country.code}-${amount}`
      } catch (error) {
        console.log(error)
      }

    }
    const orderSerialNumber = await genOrderSerialNumber()

    await postFleetOrderAction(smartWallet?.address as string, orderSerialNumber!, amount, "Paystack", reference.reference!, 0, defaultOwnerPinkSlipAttestationIDs)

    setLoading(false)
    router.push("/fleet")
};
  

const onClose = () => {
    // implementation for whatever you want to do when the Paystack dialog closed.
    console.log('closed');
    setLoading(false)
};

const initPaystackPayment = usePaystackPayment(config);

const purchaseWithPaystack = () => {
    setLoading(true)
    initPaystackPayment({onSuccess, onClose})
    


}

  return (
    <main className="flex flex-col w-full h-full items-center gap-8 p-24 max-md:p-6">
        <Drawer open={true}>
      
            <DrawerContent>
                <div className="mx-auto w-full max-w-sm">
                    <DrawerHeader>
                        <DrawerTitle>Purchase a 3-Wheeler</DrawerTitle>
                        <DrawerDescription>Choose the amount 3-Wheelers you want to purchase.</DrawerDescription>
                    </DrawerHeader>
                    <div className="flex flex-col gap-8 p-4 pb-0">
                        
                        <div className="flex items-center justify-center space-x-2">
                            <div>
                                <Image src="/images/kekeHero.svg" alt="3-Wheeler" width={100} height={100} />
                            </div>
                            <div className="text-xl font-bold tracking-tighter">
                                ${amount * price3WheelerUSD} ~ GHS{Math.ceil(amount * price3WheelerUSD * Number(currencyRate?.rate))}

                            </div>
                            </div>


                            <div>
                            

                            <div className="flex items-center justify-between space-x-2">
                                <Button
                                    variant="outline"
                                    size="icon"
                                    className="h-8 w-8 shrink-0 rounded-full"
                                    onClick={decrease}
                                    disabled={amount <= 1}

                                >
                                    <Minus />
                                    <span className="sr-only">Decrease</span>
                                </Button>
                                <div className="flex items-center justify-center space-x-2">
                                    <div className="flex-1 text-center">
                                        
                                        <div className="text-7xl font-bold tracking-tighter">
                                        {amount}
                                        </div>
                                        <div className="text-[0.70rem] uppercase text-muted-foreground">
                                        No. of 3-Wheelers
                                        </div>
                                    </div>
                                </div>
                                <Button
                                    variant="outline"
                                    size="icon"
                                    className="h-8 w-8 shrink-0 rounded-full"
                                    onClick={increase}
                                    disabled={amount >= ready3WheelerDrivers}
                                >
                                    <Plus />
                                    <span className="sr-only">Increase</span>

                                </Button>
                            </div>
                        </div>
                    </div>
                    
                    <DrawerFooter>
                        <Button disabled>Pay with External Wallet</Button>
                        <Separator />
                        <Button disabled>Pay with MiniPay</Button>
                        <Separator />
                        <Button disabled >Pay with Stripe</Button>
                        <Separator />
                        <Button disabled={!amount} onClick={purchaseWithPaystack}>
                        {
                                    loading
                                    ? (
                                        <>
                                            <motion.div
                                            initial={{ rotate: 0 }} // Initial rotation value (0 degrees)
                                            animate={{ rotate: 360 }} // Final rotation value (360 degrees)
                                            transition={{
                                                duration: 1, // Animation duration in seconds
                                                repeat: Infinity, // Infinity will make it rotate indefinitely
                                                ease: "linear", // Animation easing function (linear makes it constant speed)
                                            }}
                                        >
                                                <Ellipsis/>
                                            </motion.div>
                                        </>
                                    )
                                    : (
                                        <>
                                            Pay with Paystack
                                        </>
                                    )
                        }
                        
                        </Button>
                        
                        <DrawerClose asChild>
                        <Button variant="outline" onClick={() => router.push("/fleet")}>Cancel</Button>
                        </DrawerClose>
                    </DrawerFooter>
                </div>

            </DrawerContent>
        </Drawer>
    </main>
   
  )
}
