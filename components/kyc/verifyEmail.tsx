"use client"


import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger, DrawerDescription } from "@/components/ui/drawer"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { CloudUpload, Ellipsis, Loader2, Paperclip, SaveAll } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Profile, useGetProfile } from "@/hooks/useGetProfile"
import { sendVerifyEmail } from "@/app/actions/mail/sendVerifyMail"
import { postProfileAction } from "@/app/actions/kyc/postProfileAction"
import { verifyMailCode } from "@/app/actions/mail/verifyMailCode"

  


const FormSchema = z.object({

    email: z.string().email(),
    
})

interface VerifyEmailProps {
  address: `0x${string}`
  profile: Profile | null
}

export function VerifyEmail({ address, profile }: VerifyEmailProps) {

  
  const [code, setCode] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  
  
  
  const form = useForm < z.infer < typeof FormSchema >> ({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: undefined,
    },
  })

  async function onSubmit(values: z.infer < typeof FormSchema > ) {
    
  }

  async function sendEmailCode(email: string) {
    try {

      setLoading(true);

      //send email to validate return if email is invalid
      const token = await sendVerifyEmail(email);

      if(token) {
        localStorage.setItem('emailTokenJWT', token);
        toast.success("Email Verification code sent", {
          description: `Check your email for the verification code`,
        })
        setLoading(false);
      } 
    } catch (error) {
      console.error("Send email code error", error);
      toast.error("Email Verification failed", {
        description: `Something went wrong, Enter a valid email address`,
      })
      setLoading(false);
    }
  }

  async function verifyEmailCode(token: string, code: string) {
    try {
      if(token) {
        const verifiedEmail = await verifyMailCode(token, code);
        if(verifiedEmail) {
          //post profile preupload
          const postProfile = await postProfileAction(
            address!,
            verifiedEmail,
          );
          toast.success("Email verified successfully", {
            description: `You can now complete your KYC`,
          })
        }
      }
    } catch (error) {
      console.error("Verify email error", error);
      toast.error("Failed to verify email.", {
        description: `Invalid code or expired, please try again`,
      })
    }
  }

  return (
    <Drawer>
      <DrawerTrigger asChild>
          <Button className="max-w-fit h-12 rounded-2xl">
              Complete KYC
          </Button>
      </DrawerTrigger>
      <DrawerContent className="h-full">
        <div className="mx-auto w-full max-w-sm pb-6">
          <DrawerHeader>
              <DrawerTitle>
                Verify Email
              </DrawerTitle>
              <DrawerDescription className="max-md:text-[0.9rem]">{"Link your email account to your wallet"}</DrawerDescription>
          </DrawerHeader>
          <div className="flex flex-col p-4">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <div className="flex flex-col gap-1 w-full max-w-sm space-x-2">
                                <FormLabel className="text-yellow-600">Email</FormLabel>
                                <FormControl >
                                    <Input disabled={ !!profile } className="col-span-3" placeholder={""} {...field} />
                                </FormControl>
                            </div>
                        </FormItem>
                    )}
                />
                <div className="flex justify-between">
                    <Button
                        className="w-36"
                        disabled={loading}
                        type="submit"
                    >
                        {
                                loading
                                ? <Loader2 className="w-4 h-4 animate-spin" />
                                : <SaveAll />
                            }
                            <p>Save Changs</p>
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