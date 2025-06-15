"use client"


import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger, DrawerDescription } from "@/components/ui/drawer"
import { Button } from "@/components/ui/button"
import {  Send } from "lucide-react"
  





export function Invitation() {

  

  return (
    <Drawer>
        <DrawerTrigger asChild>
            <Button
                className="max-w-fit h-12 rounded-xl"
            >
                <Send />
                <p>Send Invites</p>
            </Button> 
        </DrawerTrigger>
        <DrawerContent className="h-full">
            <div className="mx-auto w-full max-w-sm pb-6">
            <DrawerHeader>
                <DrawerTitle>
                    Refer Friends
                </DrawerTitle>
                <DrawerDescription className="max-md:text-[0.9rem]">{"Send Invites to your friends & earn rewards"}</DrawerDescription>
            </DrawerHeader>             
            </div>
        </DrawerContent>
    </Drawer>
  );
}