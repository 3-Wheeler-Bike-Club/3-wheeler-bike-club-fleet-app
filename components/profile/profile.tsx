import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Form, FormControl, FormField, FormItem, FormLabel } from "../ui/form"
import { usePrivy } from "@privy-io/react-auth"
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle } from "../ui/drawer"
import { motion } from "framer-motion";
//import { useSmartWallets } from "@privy-io/react-auth/smart-wallets"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { Countries } from "@/utils/constants/countries"
import { setCustomPrivyMetadata } from "@/app/actions/privy/setCustomPrivyMetadata"
import { Logout } from "./logout"
import { Ellipsis } from "lucide-react"



const FormSchema = z.object({
    firstname: z.string(),
    lastname: z.string(),
    country: z.string(),
})




export function Profile () {
    const { user } = usePrivy()
    console.log(user)

    const privyUserMetadata = user?.customMetadata
    console.log(privyUserMetadata?.country);
    const did = user?.id
    const smartWallet = user?.linkedAccounts.find((account) => account.type === 'smart_wallet');
    console.log(smartWallet?.address);
    // Logs the smart wallet's address
    console.log(smartWallet?.type);
    // Logs the smart wallet type (e.g. 'safe', 'kernel', 'light_account', 'biconomy')

    //const {client} = useSmartWallets();
    
    console.log(user?.linkedAccounts)
    //const router = useRouter()
    const countries = Object.keys(Countries);
     

    const [loading, setLoading] = useState<boolean | null>(null)


    


    
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            firstname: undefined,
            lastname: undefined,
            country: undefined,
        },
    })

   
    
    
    
    async function onSubmit() {
        try {
            const firstname = form.watch("firstname")
            console.log(firstname)
            const lastname = form.watch("lastname")
            console.log(lastname)
            const country = form.watch("country")
            console.log(country)
            setLoading(true)
            if (!firstname || !lastname || !country || !did) return
    
            const privyData = {
                firstname,
                lastname,
                country,
            }

            const member = await setCustomPrivyMetadata(did, privyData)
            console.log(member)
            
            if (member?.customMetadata) {
                window.location.href = "/fleet"
            }
            
            setLoading(false)
        } catch (error) {
            console.log(error)
            setLoading(false)
        }
    }
    

    return (
        <>
            <Drawer
                open={true}
            >
                <DrawerContent>
                    <div className="mx-auto w-full max-w-sm">
                        <DrawerHeader>
                            <DrawerTitle>Edit profile</DrawerTitle>
                            <DrawerDescription>Make changes to your profile here. Click save when done.</DrawerDescription>
                        </DrawerHeader>
                        <div className="flex flex-col p-4">
                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                                    <FormField
                                        control={form.control}
                                        name="firstname"
                                        render={({ field }) => (
                                            <FormItem>
                                                <div className="flex w-full max-w-sm items-center space-x-2">
                                                    <FormLabel className="text-right">First Name</FormLabel>
                                                    <FormControl >
                                                        <Input disabled={ loading! || privyUserMetadata?.firstname as string !== undefined } className="col-span-3" placeholder={!privyUserMetadata ? "vitalik" : privyUserMetadata?.firstname as string} {...field} />
                                                    </FormControl>
                                                </div>
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="lastname"
                                        render={({ field }) => (
                                            <FormItem>
                                                <div className="flex w-full max-w-sm items-center space-x-2">
                                                    <FormLabel className="text-right">Last Name</FormLabel>
                                                    <FormControl >
                                                        <Input disabled={ loading! || privyUserMetadata?.lastname as string !== undefined } className="col-span-3" placeholder={!privyUserMetadata ? "buterin" : privyUserMetadata?.lastname as string} {...field} />
                                                    </FormControl>
                                                </div>
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name='country'
                                        render={({ field }) => (
                                            <FormItem>
                                                <div className="flex w-full max-w-sm items-center space-x-2">
                                                    <FormLabel className='text-right'>Country</FormLabel>
                                                    {
                                                        !privyUserMetadata
                                                        ?(
                                                            <>
                                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                                    <FormControl>
                                                                    <SelectTrigger className='col-span-3'>
                                                                        <SelectValue placeholder='Select a Country' />
                                                                    </SelectTrigger>
                                                                    </FormControl>
                                                                    <SelectContent className='col-span-3'>
                                                                        <SelectGroup>
                                                                            {countries!.map((country) => (
                                                                                <SelectItem
                                                                                    key={country}
                                                                                    value={country}
                                                                                >
                                                                                    {country}
                                                                                </SelectItem> 
                                                                            ))}
                                                                        </SelectGroup>
                                                                    </SelectContent>
                                                                </Select>
                                                            </>
                                                        )
                                                        :(
                                                            <>
                                                            <FormControl>
                                                                <Input disabled className='col-span-3' placeholder={privyUserMetadata?.country as string} {...field} />
                                                            </FormControl>
                                                            </>
                                                        )
                                                    }
                                                </div>
                                            
                                            </FormItem>
                                        )}
                                    />
                                    
                            
                                    <div className="flex justify-between">
                                        <Logout/>
                                        <Button
                                            className="w-36"
                                            disabled={loading! || privyUserMetadata?.lastname as string !== undefined}
                                            type="submit"
                                        >
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
                                                            <Ellipsis />
                                                        </motion.div>
                                                    </>
                                                )
                                                : (
                                                    <>
                                                        Save changes
                                                    </>
                                                )
                                            }
                                        </Button>
                                    </div>
                                </form>
                            </Form>
                        </div>
                    </div>
                </DrawerContent>
            </Drawer>
        </>
    )

}