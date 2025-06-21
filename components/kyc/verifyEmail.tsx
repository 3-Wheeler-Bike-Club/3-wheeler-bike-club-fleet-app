"use client"


import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger, DrawerDescription } from "@/components/ui/drawer"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { CloudUpload, Ellipsis, Loader2, Paperclip, SaveAll, Send } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Profile, useGetProfile } from "@/hooks/useGetProfile"
import { sendVerifyEmail } from "@/app/actions/mail/sendVerifyMail"
import { postProfileAction } from "@/app/actions/kyc/postProfileAction"
import { verifyMailCode } from "@/app/actions/mail/verifyMailCode"

  


const emailFormSchema = z.object({
  email: z.string().email(),
})
const codeFormSchema = z.object({
  code: z.string().min(6).max(6),
})

interface VerifyEmailProps {
  address: `0x${string}`
  profile: Profile | null
}

export function VerifyEmail({ address, profile }: VerifyEmailProps) {

  
  const [code, setCode] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  
  
  
  const emailForm = useForm < z.infer < typeof emailFormSchema >> ({
    resolver: zodResolver(emailFormSchema),
    defaultValues: {
      email: undefined,
    },
  })

  const codeForm = useForm < z.infer < typeof codeFormSchema >> ({
    resolver: zodResolver(codeFormSchema),
    defaultValues: {
      code: undefined,
    },
  })

  async function onSubmitEmail(values: z.infer < typeof emailFormSchema > ) {
    sendEmailCode(values.email);
  }
  async function onSubmitCode(values: z.infer < typeof codeFormSchema > ) {
    
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
      setLoading(true);
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
          setLoading(false);
        }
      }
    } catch (error) {
      console.error("Verify email error", error);
      toast.error("Failed to verify email.", {
        description: `Invalid code or expired, please try again`,
      })
      setLoading(false);
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
          <div className="flex flex-col p-4 w-full">
            <Form {...emailForm}>
              <form onSubmit={emailForm.handleSubmit(onSubmitEmail)} className="space-y-6">
                <div className="flex w-full justify-between gap-2">
                  <div className="flex flex-col w-full">
                    <FormField
                        control={emailForm.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <div className="flex flex-col gap-1 w-full max-w-sm space-x-2">
                                    <FormControl >
                                        <Input disabled={ !!profile } className="col-span-3" placeholder={""} {...field} />
                                    </FormControl>
                                </div>
                            </FormItem>
                        )}
                    />
                  </div>
                  <div className="flex justify-between w-2/10">
                      <Button
                        className="w-12"
                        disabled={loading}
                        type="submit"
                      >
                        {
                          loading
                          ? <Loader2 className="w-4 h-4 animate-spin" />
                          : <Send className="w-4 h-4" />
                        }
                      </Button>
                  </div>
                </div>
                
              </form>
            </Form>
          </div>    
          {
            code && (
              <>
                <div className="flex flex-col p-4">
                  <Form {...codeForm}>
                    <form onSubmit={codeForm.handleSubmit(onSubmitCode)} className="space-y-6">
                      
                      <FormField
                          control={codeForm.control}
                          name="code"
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
              </>
            )
          }          
        </div>
      </DrawerContent>
    </Drawer>
  );
}