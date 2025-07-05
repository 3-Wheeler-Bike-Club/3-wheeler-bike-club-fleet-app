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
import { Checkbox } from "../ui/checkbox"
import { Label } from "../ui/label"
import { getProfileByEmailAction } from "@/app/actions/kyc/getProfileByEmailAction"
import { PhoneInput } from "../ui/phone-input"
import { sendVerifyPhone } from "@/app/actions/phone/sendVerifyPhone"
import { getProfileByPhoneAction } from "@/app/actions/kyc/getProfileByPhoneAction"
import { verifyPhoneCode } from "@/app/actions/phone/verifyPhoneCode"

  


const emailFormSchema = z.object({
  email: z.string().email(),
})
const emailCodeFormSchema = z.object({
  emailCode: z.string().min(6).max(6),
})

const phoneFormSchema = z.object({
  phone: z.string()
})
const phoneCodeFormSchema = z.object({
  phoneCode: z.string().min(6).max(6),
})

const termsFormSchema = z.object({
  terms: z.boolean(),
})

interface VerifyEmailProps {
  address: `0x${string}`
  profile: Profile | null
  getProfileSync: () => void
}

export function VerifyContact({ address, profile, getProfileSync }: VerifyEmailProps) {

  const [email, setEmail] = useState<string | null>(null);
  const [phone, setPhone] = useState<string | null>(null);
  const [tryAnotherEmail, setTryAnotherEmail] = useState(false)
  const [tryAnotherPhone, setTryAnotherPhone] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [loadingLinking, setLoadingLinking] = useState(false);
  const [loadingCode, setLoadingCode] = useState(false);
  const [isDisabledEmail, setIsDisabledEmail] = useState(false);
  const [isDisabledPhone, setIsDisabledPhone] = useState(false);
  const [countdownEmail, setCountdownEmail] = useState(0);
  const [countdownPhone, setCountdownPhone] = useState(0);

  const [verifiedEmail, setVerifiedEmail] = useState(false);
  const [verifiedPhone, setVerifiedPhone] = useState(false);
  
  
  const emailForm = useForm < z.infer < typeof emailFormSchema >> ({
    resolver: zodResolver(emailFormSchema),
    defaultValues: {
      email: undefined,
    },
  })

  const emailCodeForm = useForm < z.infer < typeof emailCodeFormSchema >> ({
    resolver: zodResolver(emailCodeFormSchema),
    defaultValues: {
      emailCode: undefined,
    },
  })

  const phoneForm = useForm < z.infer < typeof phoneFormSchema >> ({
    resolver: zodResolver(phoneFormSchema),
    defaultValues: {
      phone: undefined,
    },
  })

  const phoneCodeForm = useForm < z.infer < typeof phoneCodeFormSchema >> ({
    resolver: zodResolver(phoneCodeFormSchema),
    defaultValues: {
      phoneCode: undefined,
    },
  })

  async function onSubmitEmail(values: z.infer < typeof emailFormSchema > ) {
    sendEmailCode(values.email);
  }
  async function onSubmitEmailCode(values: z.infer < typeof emailCodeFormSchema > ) {
    console.log(values);
    verifyEmailCode(values.emailCode);
  }
  async function onSubmitPhone(values: z.infer < typeof phoneFormSchema > ) {
    setLoadingCode(true);
    try {
      //check if phone is already in use
      const profile = await getProfileByPhoneAction(values.phone);
      if(profile) {
        toast.error("Phone already in use", {
          description: `Please enter a different phone number`,
        })
        setLoadingCode(false);
      } 
      setPhone(values.phone);
      sendVerifyPhone(values.phone);
      setIsDisabledPhone(true);
      setCountdownPhone(60);
      setLoadingCode(false);
    } catch (error) {
      console.error("Send phone code error", error);
      toast.error("Phone Verification failed", {
        description: `Something went wrong, Enter a valid phone number`,
      })
      setLoadingCode(false);

    }
  }
  async function onSubmitPhoneCode(values: z.infer < typeof phoneCodeFormSchema > ) {
    console.log(values);
    verifyPhoneCode(values.phoneCode, phone!);
  }

  async function sendEmailCode(email: string) {
    try {

      setLoadingCode(true);

      //check if email is already in use
      const profile = await getProfileByEmailAction(email.toLowerCase());
      if(profile) {
        toast.error("Email already in use", {
          description: `Please enter a different email address`,
        })
        setLoadingCode(false);
      } else {
        //send email to validate return if email is invalid
        const token = await sendVerifyEmail(email);

        if(token) {
          setEmail(email);
          setToken(token);
          toast.success("Email Verification code sent", {
            description: `Check your email for the verification code`,
          })
          setLoadingCode(false);
          setIsDisabledEmail(true);
          setCountdownEmail(60);
        } 
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
          /*
          const postProfile = await postProfileAction(
            address!,
            email!.toLowerCase(),
          );
          */
          setVerifiedEmail(true);
          if(verifiedEmail) {
            toast.success("Email verified successfully", {
              description: `You can now complete your KYC`,
            })
            //getProfileSync();
          } else {
            toast.error("Failed to verify email.", {
              description: `Invalid code or expired, please try again`,
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
/*
  async function sendPhoneCode(phone: string) {
    setIsDisabledPhone(true);
    setCountdownPhone(60);
  }
  async function verifyPhoneCode(code: string) {}
*/
  useEffect(() => {
    let intervalEmail: NodeJS.Timeout;
    let intervalPhone: NodeJS.Timeout;
    
    if (countdownEmail > 0) {
      intervalEmail = setInterval(() => {
        setCountdownEmail((prev) => {
          if (prev <= 1) {
            setIsDisabledEmail(false);
            setTryAnotherEmail(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    if (countdownPhone > 0) {
      intervalPhone = setInterval(() => {
        setCountdownPhone((prev) => {
          if (prev <= 1) {
            setIsDisabledPhone(false);
            setTryAnotherPhone(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (intervalEmail) {
        clearInterval(intervalEmail);
      }
      if (intervalPhone) {
        clearInterval(intervalPhone);
      }
    };
  }, [countdownEmail, countdownPhone]);

  return (
    <Drawer>
      <DrawerTrigger asChild>
          <Button className="max-w-fit h-12 rounded-2xl">
              Link Contacts
          </Button>
      </DrawerTrigger>
      <DrawerContent className="h-full">
        <div className="mx-auto w-full max-w-sm pb-6">
          <DrawerHeader>
              <DrawerTitle>
                Verify Contact Information 
              </DrawerTitle>
              <DrawerDescription className="max-md:text-[0.9rem]">
                {
                  !verifiedEmail && !verifiedPhone && (
                    <p>
                      Step 1 of 3: Email Verification
                    </p>
                  )
                }
                {
                  verifiedEmail && !verifiedPhone && (
                    <p>
                      Step 2 of 3: Phone Verification
                    </p>
                  )
                }
                {
                  verifiedEmail && verifiedPhone && (
                    <p>
                      Step 3 of 3: Terms and Conditions
                    </p>
                  ) 
                }
              </DrawerDescription>
          </DrawerHeader>
          {
            !verifiedEmail && !verifiedPhone && (
              <>
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
                                      <FormLabel>Enter your email address</FormLabel>
                                          <FormControl >
                                              <Input disabled={ !!profile || !!email || loadingCode} className="col-span-3" placeholder={""} {...field} />
                                          </FormControl>
                                      </div>
                                  </FormItem>
                              )}
                          />
                        </div>
                        <div className="flex items-end justify-center w-2/10">
                            <Button
                              className="w-12"
                              disabled={loadingCode || isDisabledEmail}
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
                                emailCodeForm.reset();
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
                      isDisabledEmail && (
                        <div className="flex flex-col w-full">
                          <p className="text-[0.6rem] text-gray-500">
                            You can only send a new code in <span className="text-yellow-600">{countdownEmail}</span> seconds.
                          </p>
                        </div>
                      )
                    }
                  </Form>
                </div> 
                <>
                  <div className="flex flex-col p-4 w-full">
                    <Form {...emailCodeForm}>
                      <form onSubmit={emailCodeForm.handleSubmit(onSubmitEmailCode)} className="space-y-6">
                        <FormField
                          control={emailCodeForm.control}
                          name="emailCode"
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
                              disabled={loadingLinking || emailCodeForm.getValues("emailCode")?.length < 6 || !email}
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
              </>
            )
          }
          {
            verifiedEmail && !verifiedPhone && (
              <>
                <div className="flex flex-col p-4 w-full pb-10">
                  <Form {...phoneForm}>
                    <form onSubmit={phoneForm.handleSubmit(onSubmitPhone)} className="space-y-6">
                      <div className="flex w-full justify-between gap-2">
                        <div className="flex flex-col w-full">
                        <FormField
                          control={phoneForm.control}
                          name="phone"
                          render={({ field }) => (
                            <FormItem className="flex flex-col items-start">
                              <div className="flex flex-col gap-1 w-full max-w-sm space-x-2">
                                <FormLabel>Enter your phone number</FormLabel>
                                <FormControl className="w-full">
                                  <PhoneInput
                                    disabled={ !!profile?.phone || loadingCode } 
                                    placeholder={profile?.phone ? profile.phone : "Enter your phone number"}
                                    className="col-span-3"
                                    defaultCountry="GH"
                                    {...field}
                                  />
                                </FormControl>
                              </div>
                            </FormItem>
                          )}
                        />
                        </div>
                        <div className="flex items-end justify-center w-2/10">
                            <Button
                              className="w-12"
                              disabled={loadingCode || isDisabledPhone}
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
                      tryAnotherPhone && (
                        <div className="flex flex-col w-full">
                          <p className="text-[0.6rem] text-gray-500">
                            Did you enter the wrong phone number? 
                            <span 
                              onClick={() => {
                                setPhone(null);
                                setTryAnotherPhone(false);
                                setToken(null);
                                phoneCodeForm.reset();
                                setLoadingLinking(false);
                              }} 
                              className="text-yellow-600"
                            >
                              Try another phone number
                            </span>.
                          </p>
                        </div>
                      )
                    }
                    {
                      isDisabledPhone && (
                        <div className="flex flex-col w-full">
                          <p className="text-[0.6rem] text-gray-500">
                            You can only send a new code in <span className="text-yellow-600">{countdownPhone}</span> seconds.
                          </p>
                        </div>
                      )
                    }
                  </Form>
                </div> 
                <>
                  <div className="flex flex-col p-4 w-full">
                    <Form {...phoneCodeForm}>
                      <form onSubmit={phoneCodeForm.handleSubmit(onSubmitPhoneCode)} className="space-y-6">
                        <FormField
                          control={phoneCodeForm.control}
                          name="phoneCode"
                          render={({ field }) => (
                            <FormItem>
                              <div className="flex flex-col gap-1 w-full max-w-sm space-x-2">
                                <FormLabel>Enter One-Time Password</FormLabel>
                                <FormControl>
                                  <div className="flex justify-center">
                                    <InputOTP pattern={ REGEXP_ONLY_DIGITS } maxLength={6} disabled={loadingLinking || !phone} {...field} className="w-full ">
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
                              disabled={loadingLinking || phoneCodeForm.getValues("phoneCode")?.length < 6 || !phone}
                              type="submit"
                          >
                              {
                                      loadingLinking
                                      ? <Loader2 className="w-4 h-4 animate-spin" />
                                      : <Link />
                                  }
                                  <p>Link Phone</p>
                          </Button>
                        </div>
                      </form>
                    </Form>
                  </div>  
                </>
              </>
            )
          }
          {
            verifiedEmail && verifiedPhone && (
              <>
                Step 3 of 3: Terms and Conditions
              </>
            ) 
          }
          
                  
        </div>
      </DrawerContent>
    </Drawer>
  );
}

/*

*/

/*
<FormField
  control={codeForm.control}
  name="terms"
  render={({ field }) => (
    <FormItem>
      <div className="flex flex-col gap-1 w-full max-w-sm space-x-2">
        <FormLabel></FormLabel>
        <FormControl>
          <Label className="hover:bg-accent/50 flex items-start gap-3 rounded-lg border p-3 has-[[aria-checked=true]]:border-yellow-600 has-[[aria-checked=true]]:bg-yellow-50 dark:has-[[aria-checked=true]]:border-yellow-900 dark:has-[[aria-checked=true]]:bg-yellow-950">
            <Checkbox
              id="toggle-2"
              defaultChecked={field.value}
              onCheckedChange={field.onChange}
              className="data-[state=checked]:border-yellow-600 data-[state=checked]:bg-yellow-600 data-[state=checked]:text-white dark:data-[state=checked]:border-yellow-700 dark:data-[state=checked]:bg-yellow-700"
            />
            <div className="grid gap-1.5 font-normal">
              <p className="text-sm leading-none font-medium">
                Accept terms and conditions
              </p>
              <p className="text-muted-foreground text-sm">
                By clicking this checkbox, you agree to the <a href="https://finance.3wb.club/legal" target="_blank" className="text-yellow-600">terms and conditions</a>.
              </p>
            </div>
          </Label>
        </FormControl>
      </div>
    </FormItem>
  )}
/>
*/