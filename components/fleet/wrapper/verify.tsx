"use client"

import { useState } from "react";
import { Drawer, DrawerContent, DrawerTitle, DrawerHeader, DrawerDescription, DrawerTrigger } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Ellipsis } from "lucide-react";
import { Input } from "@/components/ui/input"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { motion } from "framer-motion"
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"




const FormSchema = z.object({
    firstname: z.string(),
    lastname: z.string(),
    othername: z.string(),
    email: z.string().email(),
    id: z.string(),
})


export function Verify() {

    const [files, setFiles] = useState < File[] | null > (null);

    const dropZoneConfig = {
        maxFiles: 2,
        maxSize: 1024 * 1024 * 4,
        multiple: true,
    };
    
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            firstname: undefined,
            lastname: undefined,
            othername: undefined,
            email: undefined,
            id: undefined,
        },
    })

    async function onSubmit() {}

    return (
        <Drawer>
                <DrawerTrigger asChild>
                    <Button className="max-w-fit h-12 rounded-2xl">
                        Complete KYC
                        {/** <PersonStanding className="text-yellow-600" /> */}
                    </Button>
                </DrawerTrigger>
                <DrawerContent className="h-full">
                <div className="mx-auto w-full max-w-sm pb-6">
                    <DrawerHeader>
                        <DrawerTitle>
                            Verify Your Identity
                        </DrawerTitle>
                        <DrawerDescription className="max-md:text-[0.9rem]">Enter Full Name, Scan & Upload your ID.</DrawerDescription>
                    </DrawerHeader>
                    <div className="flex flex-col p-4">
                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                                    <FormField
                                        control={form.control}
                                        name="firstname"
                                        render={({ field }) => (
                                            <FormItem>
                                                <div className="flex flex-col gap-1 w-full max-w-sm space-x-2">
                                                    <FormLabel className="">First Name</FormLabel>
                                                    <FormControl >
                                                        <Input disabled={ true } className="col-span-3" placeholder={""} {...field} />
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
                                                <div className="flex flex-col gap-1 w-full max-w-sm space-x-2">
                                                    <FormLabel className="">Last Name</FormLabel>
                                                    <FormControl >
                                                        <Input disabled={ true } className="col-span-3" placeholder={""} {...field} />
                                                    </FormControl>
                                                </div>
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="othername"
                                        render={({ field }) => (
                                            <FormItem>
                                                <div className="flex flex-col gap-1 w-full max-w-sm space-x-2">
                                                    <FormLabel className="">Other Name</FormLabel>
                                                    <FormControl >
                                                        <Input disabled={ true } className="col-span-3" placeholder={""} {...field} />
                                                    </FormControl>
                                                </div>
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="email"
                                        render={({ field }) => (
                                            <FormItem>
                                                <div className="flex flex-col gap-1 w-full max-w-sm space-x-2">
                                                    <FormLabel className="">Email</FormLabel>
                                                    <FormControl >
                                                        <Input disabled={ true } className="col-span-3" placeholder={""} {...field} />
                                                    </FormControl>
                                                </div>
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="id"
                                        render={({ field }) => (
                                            <FormItem>
                                                <div className="flex flex-col gap-1 w-full max-w-sm space-x-2">
                                                    <FormLabel className="">ID</FormLabel>
                                                    {
                                                        !false
                                                        ?(
                                                            <>
                                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                                    <FormControl>
                                                                    <SelectTrigger className='col-span-3'>
                                                                        <SelectValue placeholder='Select an ID' />
                                                                    </SelectTrigger>
                                                                    </FormControl>
                                                                    <SelectContent className='col-span-3'>
                                                                        <SelectItem value="passport">Passport</SelectItem>
                                                                        <SelectItem value="drivers">Driver's License</SelectItem>
                                                                        <SelectItem value="national">National ID</SelectItem>
                                                                    </SelectContent>
                                                                </Select>
                                                            </>
                                                        )
                                                        :(
                                                            <>
                                                                <FormControl>
                                                                    <Input disabled className='col-span-3' placeholder={""} {...field} />
                                                                </FormControl>
                                                            </>
                                                        )
                                                    }
                                                </div>
                                            </FormItem>
                                        )}
                                    />
                                    
                            
                                    <div className="flex justify-between">
                                        <Button
                                            className="w-36"
                                            disabled={true}
                                            type="submit"
                                        >
                                            {
                                                true
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
    );
}