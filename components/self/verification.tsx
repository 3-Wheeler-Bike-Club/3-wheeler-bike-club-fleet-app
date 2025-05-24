"use client"

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { v4 as uuidv4 } from "uuid";
import { Drawer, DrawerContent, DrawerTitle, DrawerHeader, DrawerDescription, DrawerTrigger } from "../ui/drawer";
import { Button } from "../ui/button";
import { PersonStanding } from "lucide-react";

// Dynamically import the QR component with no SSR
const QR = dynamic(() => import('./qr').then(mod => mod.QR), {
    ssr: false
});

export function Verification() {
    const [userId, setUserId] = useState<string | null>(null);

    useEffect(() => {
        // Generate a user ID when the component mounts
        setUserId(uuidv4());
    }, []);

    if (!userId) return null;

    return (
        <Drawer>
                <DrawerTrigger asChild>
                    <Button variant="outline" className="max-w-fit h-12 rounded-2xl">
                        <PersonStanding className="text-yellow-600" /> 
                    </Button>
                </DrawerTrigger>
                <DrawerContent className="h-full">
                <div className="mx-auto w-full max-w-sm pb-6">
                    <DrawerHeader>
                        <DrawerTitle>
                            Verify Your Identity
                        </DrawerTitle>
                        <DrawerDescription className="max-md:text-[0.9rem]">Scan this QR, verify your identity w/ Self & enable withdrawals.</DrawerDescription>
                    </DrawerHeader>
                    <div className="flex flex-col gap-2 p-4 pb-0">
                        <div>
                            <QR userId={userId} />
                            <p className="text-sm text-gray-500">
                                User ID: {userId.substring(0, 8)}...
                            </p>
                        </div>
                    </div>
                </div>
                </DrawerContent>
        </Drawer>
    );
}