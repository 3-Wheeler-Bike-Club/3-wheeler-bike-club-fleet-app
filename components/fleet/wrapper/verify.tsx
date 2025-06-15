"use client"

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { v4 as uuidv4 } from "uuid";
import { Drawer, DrawerContent, DrawerTitle, DrawerHeader, DrawerDescription, DrawerTrigger } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { PersonStanding } from "lucide-react";


export function Verify() {

    return (
        <Drawer>
                <DrawerTrigger asChild>
                    <Button variant="outline" className="max-w-fit h-12 rounded-2xl">
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
                    
                </div>
                </DrawerContent>
        </Drawer>
    );
}