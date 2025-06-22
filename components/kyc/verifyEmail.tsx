"use client"


import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger, DrawerDescription } from "@/components/ui/drawer"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Link, Loader2, Send } from "lucide-react"
import { useState, useEffect } from "react"
import { toast } from "sonner"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Profile } from "@/hooks/useGetProfile"
import { sendVerifyEmail } from "@/app/actions/mail/sendVerifyMail"
import { postProfileAction } from "@/app/actions/kyc/postProfileAction"
import { verifyMailCode } from "@/app/actions/mail/verifyMailCode"
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from "../ui/input-otp"
import { REGEXP_ONLY_DIGITS } from "input-otp"

  


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

  const [email, setEmail] = useState<string | null>(null);
  const [tryAnotherEmail, setTryAnotherEmail] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [loadingLinking, setLoadingLinking] = useState(false);
  const [loadingCode, setLoadingCode] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const [countdown, setCountdown] = useState(0);
  
  
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
    verifyEmailCode(values.code);
  }

  async function sendEmailCode(email: string) {
    try {

      setLoadingCode(true);

      //send email to validate return if email is invalid
      const token = await sendVerifyEmail(email);

      if(token) {
        setEmail(email);
        setToken(token);
        toast.success("Email Verification code sent", {
          description: `Check your email for the verification code`,
        })
        setLoadingCode(false);
        setIsDisabled(true);
        setCountdown(60);
      } 
    } catch (error) {
      console.error("Send email code error", error);
      toast.error("Email Verification failed", {
        description: `Something went wrong, Enter a valid email address`,
      })
      setLoadingCode(false);
    }
  }

  async function verifyEmailCode(code: string) {
    try {
      setLoadingLinking(true);
      if(token) {
        const verifiedEmail = await verifyMailCode(token, code);
        if(verifiedEmail) {
          //post profile preupload
          const postProfile = await postProfileAction(
            address!,
            email!,
          );
          if(postProfile) {
            toast.success("Email verified successfully", {
              description: `You can now complete your KYC`,
            })
          } else {
            toast.error("Failed to link email.", {
              description: `Something went wrong, please try again`,
            })
          }
          setLoadingLinking(false);
        } else {
          toast.error("Failed to verify email.", {
            description: `Invalid code or expired, please try again`,
          })
          setLoadingLinking(false);
        }
      }
    } catch (error) {
      console.error("Verify email error", error);
      toast.error("Failed to verify email.", {
        description: `Invalid code or expired, please try again`,
      })
      setLoadingLinking(false);
    }
  }

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (countdown > 0) {
      interval = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            setIsDisabled(false);
            setTryAnotherEmail(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [countdown]);

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
          <div className="flex flex-col p-4 w-full pb-10">
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
                                        <Input disabled={ !!profile || !!email || loadingCode} className="col-span-3" placeholder={""} {...field} />
                                    </FormControl>
                                </div>
                            </FormItem>
                        )}
                    />
                  </div>
                  <div className="flex justify-between w-2/10">
                      <Button
                        className="w-12"
                        disabled={loadingCode || isDisabled}
                        type="submit"
                      >
                        {
                          loadingCode
                          ? <Loader2 className="w-4 h-4 animate-spin" />
                          : <Send className="w-4 h-4" />
                        }
                      </Button>
                  </div>
                </div>
                
              </form>
              {
                tryAnotherEmail && (
                  <div className="flex flex-col w-full">
                    <p className="text-[0.6rem] text-gray-500">
                      Did you enter the wrong email? 
                      <span 
                        onClick={() => {
                          setEmail(null);
                          setTryAnotherEmail(false);
                          setToken(null);
                          codeForm.reset();
                          setLoadingLinking(false);
                        }} 
                        className="text-yellow-600"
                      >
                        Try another email
                      </span>.
                    </p>
                  </div>
                )
              }
              {
                isDisabled && (
                  <div className="flex flex-col w-full">
                    <p className="text-[0.6rem] text-gray-500">
                      You can only send a new code in <span className="text-yellow-600">{countdown}</span> seconds.
                    </p>
                  </div>
                )
              }
            </Form>
          </div> 
          
          {
            email && (
              <>
                <div className="flex flex-col p-4 w-full">
                  <Form {...codeForm}>
                    <form onSubmit={codeForm.handleSubmit(onSubmitCode)} className="space-y-6">
                      <FormField
                        control={codeForm.control}
                        name="code"
                        render={({ field }) => (
                          <FormItem>
                            <div className="flex flex-col gap-1 w-full max-w-sm space-x-2">
                              <FormLabel>Enter One-Time Password</FormLabel>
                              <FormControl>
                                <div className="flex justify-center">
                                  <InputOTP pattern={REGEXP_ONLY_DIGITS } maxLength={6} disabled={loadingLinking || !email} {...field} className="w-full ">
                                    <InputOTPGroup>
                                      <InputOTPSlot index={0} />
                                      <InputOTPSlot index={1} />
                                      <InputOTPSlot index={2} />
                                    </InputOTPGroup>
                                    <InputOTPSeparator />
                                    <InputOTPGroup>
                                      <InputOTPSlot index={3} />
                                      <InputOTPSlot index={4} />
                                      <InputOTPSlot index={5} />
                                    </InputOTPGroup>
                                  </InputOTP>
                                </div>
                              </FormControl>
                            </div>
                          </FormItem>
                        )}
                      />
                      <div className="flex justify-between">
                        <div/>
                        <Button
                            className="w-36"
                            disabled={loadingLinking || codeForm.getValues("code")?.length < 6 || !email}
                            type="submit"
                        >
                            {
                                    loadingLinking
                                    ? <Loader2 className="w-4 h-4 animate-spin" />
                                    : <Link />
                                }
                                <p>Link Email</p>
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