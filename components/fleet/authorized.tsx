import { ArrowRightFromLine, Caravan, CircleAlert, DiamondPlus, HandCoins } from "lucide-react";
import { Menu } from "../topnav/menu";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Separator } from "../ui/separator";

export function Authorized() {

    

    return (
        <main className="flex h-full w-full">
            <div className="flex flex-col h-full p-4 md:p-6 lg:p-8 w-full gap-6">
                <Menu/>


                <div className="flex w-full justify-center">
                    <Alert className="w-full max-w-[66rem]">
                        <Caravan className="h-4 w-4" />
                        <AlertTitle className="font-bold">Fleet!</AlertTitle>
                        <AlertDescription className="text-xs italic">
                            Manage your hire purchase 3 Wheelers.
                        </AlertDescription>
                    </Alert>
                </div>

                <div className="flex w-full items-center justify-center">
                    <div className="flex w-full max-w-[66rem] gap-4">
                        <Card className="w-full max-w-1/2">
                            <CardHeader>
                                <CardTitle>
                                    <div className="flex items-center gap-2">
                                        <HandCoins className="h-6 w-6" />
                                        <p className="text-lg">Buy a 3-Wheeler</p>
                                    </div>
                                </CardTitle>
                            </CardHeader>

                            <CardContent>
                                <Button className="w-full justify-end">
                                    <p>Get Brand New </p>
                                    <ArrowRightFromLine />
                                </Button>
                            </CardContent>

                        </Card>

                        <Card className="w-full max-w-1/2">
                            <CardHeader>
                                <CardTitle>
                                    <div className="flex items-center gap-2">
                                        <DiamondPlus className="h-6 w-6" />
                                        <p className="text-lg">Add a 3-Wheeler</p>
                                    </div>                                 
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Button className="w-full justify-end">
                                    <p>Schedule Visit </p>
                                    <ArrowRightFromLine />
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                    
                </div>

                
                {
                    true 
                    ?(
                        <div className="flex flex-col items-center w-full justify-center gap-6">
                            <Separator className="w-full max-w-[66rem]" />
                            <div className="max-w-[66rem] flex flex-col items-center justify-center gap-6">
                                
                                <CircleAlert className="h-36 w-36" />
                                <p className="text-3xl">No vehicles found, please add/buy a 3-Wheeler.</p>
                            </div>
                        </div>

                    )
                    /** else show fleet in carousel */
                    :(
                        <div className="flex w-full max-w-[66rem] justify-center gap-4">
                    
                        </div>
                    )
                }

                

            </div>

        </main>



    )
}

