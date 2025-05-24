"use client"

import React, { useState, useEffect } from 'react';
import SelfQRcodeWrapper, { SelfAppBuilder } from '@selfxyz/qrcode';
import { v4 as uuidv4 } from 'uuid';
import { Drawer, DrawerContent, DrawerTitle, DrawerHeader, DrawerDescription, DrawerTrigger } from '../ui/drawer';
import { Button } from '../ui/button';
import { PersonStanding } from 'lucide-react';

export function Verification() {
    const [userId, setUserId] = useState<string | null>(null);

    useEffect(() => {
        // Generate a user ID when the component mounts
        setUserId(uuidv4());
    }, []);

    if (!userId) return null;

    // Create the SelfApp configuration
    const selfApp = new SelfAppBuilder({
        appName: "3WB P2P Fleet Finance",
        scope: "my-application-scope",
        endpoint: "https://finance.3wb.club/api/verify",
        endpointType: "https",
        userId,
        userIdType: "uuid"
    }).build();

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
                            <SelfQRcodeWrapper
                                selfApp={selfApp}
                                onSuccess={() => {
                                // Handle successful verification
                                console.log("Verification successful!");
                                // Redirect or update UI
                                }}
                                size={350}
                            />
                            
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