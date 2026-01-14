"use client"


import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger, DrawerDescription } from "@/components/ui/drawer"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Camera, CloudUpload, FileWarning, Hourglass, Loader2, Paperclip, Save, Scan, Undo2 } from "lucide-react"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { FileUploader, FileUploaderContent, FileUploaderItem, FileInput } from "@/components/ui/file-upload"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useUploadThing } from "@/hooks/useUploadThing"
import { updateLiquidityProviderAction } from "@/app/actions/kyc/updateLiquidityProviderAction"
import { LiquidityProvider } from "@/hooks/useGetLiquidityProvider"
import { Label } from "@/components/ui/label"
import { SelfAppBuilder, SelfQRcode } from "@selfxyz/qrcode"
import { sendVerifySelfMail } from "@/app/actions/mail/sendVerifySelfMail"
import { sendVerifySelfAdminMail } from "@/app/actions/mail/sendVerifySelfAdminMail"

  

const SelfFormSchema = z.object({
  firstname: z.string(),
  othername: z.string(),
  lastname: z.string(),
})

const ManualFormSchema = z.object({
    firstname: z.string(),
    othername: z.string(),
    lastname: z.string(),
    
})

interface VerifyKYCProps {
  address: `0x${string}`
  liquidityProvider: LiquidityProvider
  getLiquidityProviderSync: () => void
}

export function VerifyKYC({ address, liquidityProvider, getLiquidityProviderSync }: VerifyKYCProps) {

  const [files, setFiles] = useState < File[] | null > (null);
  console.log(files);
  const [loading, setLoading] = useState(false);
  const [manualVerification, setManualVerification] = useState(false);
  const [qr, setQR] = useState<boolean>(false);
  const [upload, setUpload] = useState<boolean>(false);


  // Create the SelfApp configuration
  const selfApp = new SelfAppBuilder({
    appName: "3 Wheeler Bike Club",
    scope: "finance-3wb-club",
    endpoint: "https://finance.3wb.club/api/verify",
    endpointType: "https",
    logoBase64: "https://finance.3wb.club/icons/logo.png",
    userId: address,
    userIdType: "hex",
    version: 2,
    userDefinedData: "0x" + Buffer.from("default").toString('hex').padEnd(128, '0'),
    disclosures: {
        name: true,
        expiry_date: true,
        nationality: true,
        minimumAge: 18,
        excludedCountries: ["USA", "CUB", "IRN", "PRK", "RUS"],
        ofac: true,
    }
  }).build();

  const { startUpload, routeConfig } = useUploadThing("imageUploader", {
    onClientUploadComplete: () => {
      toast.info("ID Uploaded", {
        description: "Please wait while we save the rest of your details",
      })
    },
    onUploadError: () => {
      toast.error("Failed to upload files.", {
        description: `Something went wrong, please try again`,
      })
      setLoading(false);
    },
    onUploadBegin: (file: string) => {
      console.log("upload has begun for", file);
    },
  });
  
  const selfForm = useForm < z.infer < typeof SelfFormSchema >> ({
    resolver: zodResolver(SelfFormSchema),
    defaultValues: {
      firstname: undefined,
      othername: undefined,
      lastname: undefined,
    },
  })
  const manualForm = useForm < z.infer < typeof ManualFormSchema >> ({
    resolver: zodResolver(ManualFormSchema),
    defaultValues: {
      firstname: undefined,
      othername: undefined,
      lastname: undefined,
    },
  })

  async function onSubmitSelf(values: z.infer < typeof SelfFormSchema > ) {
    setQR(true);
  }

  async function onSubmitManual(values: z.infer < typeof ManualFormSchema > ) {
    setUpload(true);
  }

  async function onSubmitManualUpload() {
    const manualFormValues = manualForm.getValues();
    setLoading(true);
    try {
      if(files && files.length > 0) {
        
        if (files.length != 2) {
          toast.error("National ID must have both front and back scans", {
            description: `Please upload both the front and back of your National ID`,
          })
          setLoading(false);
          return;
        } 
        
        const uploadFiles = await startUpload(files);
          if(uploadFiles) {
            //update liquidity provider with files
            const updateLiquidityProvider = await updateLiquidityProviderAction(
              address!,
              manualFormValues.firstname,
              manualFormValues.othername,
              manualFormValues.lastname,
              uploadFiles.map((file) => file.ufsUrl),
              "manual"
            );
            if (updateLiquidityProvider) {
              await sendVerifySelfMail(
                liquidityProvider.email,
                manualFormValues.firstname
              )
              await sendVerifySelfAdminMail(
                manualFormValues.firstname,
                manualFormValues.othername,
                manualFormValues.lastname
              )
              toast.success("KYC Completed", {
                description: "Our Team will review your KYC and get back to you shortly",
              })
              setLoading(false);
              getLiquidityProviderSync();
            } else {
              toast.error("KYC Failed", {
                description: `Something went wrong, please try again`,
              })
              setLoading(false);
            }
          }
      } else {
        toast.error("No ID Uploaded", {
          description: `Please upload your ID`,
        })
        setLoading(false);
      }
    } catch (error) {
      console.error("Form submission error", error);
      toast.error("Failed to submit the form.", {
        description: `Something went wrong, please try again`,
      })
      setLoading(false);
    }

  }

  return (
    <Drawer>
      <DrawerTrigger asChild>
          <Button className="max-w-fit h-12 rounded-2xl">
              {
                liquidityProvider.national.length > 0
                ? <p>View KYC Profile</p>
                : <p>Complete KYC</p>
              }
          </Button>
      </DrawerTrigger>
      <DrawerContent className="h-full">
        <div className="mx-auto w-full max-w-sm pb-6">
          <DrawerHeader>
              <DrawerTitle>
                Verify Your Identity
              </DrawerTitle>
              <DrawerDescription className="max-md:text-[0.9rem]">
                {
                  manualVerification
                  ?(
                    <>
                      {
                        upload && (
                          <p>Step 2 of 2: Scan & Upload ID</p>
                        )
                      }
                      {
                        !upload && (
                          <p>Step 1 of 2: Enter Full Name</p>
                        )
                      }
                    </>
                  )
                  :(
                    <>
                      {
                        qr && (
                          <p>Step 2 of 2: Scan QR w/ Self.xyz app</p>
                        )
                      }
                      {
                        !qr && (
                          <p>Step 1 of 2: Enter Full Name</p>
                        )
                      }
                    </>
                  )
                }
              </DrawerDescription>
          </DrawerHeader>
          {
            manualVerification
            ?(
              <>
              {
                upload && (
                  <>
                    <div className="flex flex-col p-4 space-y-6">
                      <div className="flex flex-col">
                        <Label className="text-yellow-600">Upload ID <span className="text-xs text-muted-foreground">(must be under 4MB)</span></Label>
                        <div>
                          <FileUploader
                            value={files}
                            onValueChange={setFiles}
                            dropzoneOptions={{
                              maxFiles: 2,
                              maxSize: 1024 * 1024 * 4,
                              multiple: true,
                              accept: {
                                "image/*": [".png", ".jpg", ".jpeg"],
                              },
                            }}
                            className="relative bg-background rounded-lg p-2"
                          >
                            <FileInput
                              id="fileInput"
                              className="outline-dashed outline-1 outline-slate-500"
                            >
                              <div className="flex items-center justify-center flex-col py-2 w-full ">
                                <CloudUpload className='text-gray-500 w-10 h-10' />
                                <p className="mb-1 text-sm text-gray-500 dark:text-gray-400">
                                  <span className="font-semibold">Click to upload </span>
                                  or drag and drop
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                  PNG, JPG or JPEG
                                </p>
                              </div>
                            </FileInput>
                            <FileUploaderContent>
                              {files &&
                                files.length > 0 &&
                                files.map((file, i) => (
                                  <FileUploaderItem key={i} index={i}>
                                    <Paperclip className="h-4 w-4 stroke-current" />
                                    <span>{file.name}</span>
                                  </FileUploaderItem>
                                ))}
                            </FileUploaderContent>
                          </FileUploader>
                        </div>
                        <div className="text-xs text-muted-foreground text-center">{"Upload the Front Photo of your Passport or both sides of any National ID"}</div>
                      </div>
                      <div className="flex justify-between">
                        <Button
                          disabled={loading}
                          className="w-1/2"
                          variant="outline"
                          onClick={() => {
                            setUpload(false);
                          }}
                        >
                          <Undo2   />
                        </Button>
                        <Button
                          onClick={onSubmitManualUpload}
                          disabled={loading}
                        >
                          {
                            loading
                            ? <Loader2 className="w-4 h-4 animate-spin" />
                            : <Save />
                          }
                          <p>Save & Submit</p>
                        </Button>
                      </div>
                    </div>  
                  </>
                )
              }
              {
                !upload && (
                  <>
                  <div className="flex flex-col p-4">
                  <Form {...manualForm}>
                    <form onSubmit={manualForm.handleSubmit(onSubmitManual)} className="space-y-6">
                      <FormField
                        control={manualForm.control}
                        name="firstname"
                        render={({ field }) => (
                            <FormItem>
                                <div className="flex flex-col gap-1 w-full max-w-sm space-x-2">
                                    <FormLabel className="text-yellow-600">First Name</FormLabel>
                                    <FormControl >
                                        <Input 
                                          autoComplete="off" 
                                          disabled={ !!liquidityProvider.firstname || loading } 
                                          className="col-span-3" 
                                          placeholder={liquidityProvider.firstname ? liquidityProvider.firstname.toUpperCase() : "VITALIK"} 
                                          {...field}
                                          onChange={(e) => {
                                            field.onChange(e.target.value.toUpperCase())
                                          }}
                                        />
                                    </FormControl>
                                </div>
                            </FormItem>
                        )}
                      />
                      <FormField
                          control={manualForm.control}
                          name="othername"
                          render={({ field }) => (
                              <FormItem>
                                  <div className="flex flex-col gap-1 w-full max-w-sm space-x-2">
                                      <FormLabel className="text-yellow-600">Other Name(s)</FormLabel>
                                      <FormControl >
                                          <Input 
                                            autoComplete="off" 
                                            disabled={ !!liquidityProvider.othername || loading } 
                                            className="col-span-3" 
                                            placeholder={liquidityProvider.othername ? liquidityProvider.othername.toUpperCase() : "DOTETH"} 
                                            {...field}
                                            onChange={(e) => {
                                              field.onChange(e.target.value.toUpperCase())
                                            }}
                                          />
                                      </FormControl>
                                  </div>
                              </FormItem>
                          )}
                      />
                      <FormField
                          control={manualForm.control}
                          name="lastname"
                          render={({ field }) => (
                              <FormItem>
                                  <div className="flex flex-col gap-1 w-full max-w-sm space-x-2">
                                      <FormLabel className="text-yellow-600">Last Name</FormLabel>
                                      <FormControl >
                                          <Input 
                                            autoComplete="off" 
                                            disabled={ !!liquidityProvider.lastname || loading } 
                                            className="col-span-3" 
                                            placeholder={liquidityProvider.lastname ? liquidityProvider.lastname.toUpperCase() : "BUTERIN"} 
                                            {...field}
                                            onChange={(e) => {
                                              field.onChange(e.target.value.toUpperCase())
                                            }}
                                          />
                                      </FormControl>
                                  </div>
                              </FormItem>
                          )}
                      />
                      <div className="flex">
                          
                          <Button
                              className="w-full"
                              disabled={loading || liquidityProvider.national.length > 0}
                              type="submit"
                          >
                              {
                                  loading
                                  ? <Loader2 className="w-4 h-4 animate-spin" />
                                  : (
                                    liquidityProvider.national.length > 0
                                    ? <Hourglass />
                                    : <Scan />
                                  )
                              }
                              {
                                liquidityProvider.national.length > 0
                                ? <p>KYC Review Pending...</p>
                                : <p>Scan & Upload ID</p>
                              }
                          </Button>
                      </div>
                    </form>
                  </Form>
                </div>  
                  </>
                )
              }
              <div className="flex flex-col items-center gap-2 mt-4 mb-2">
                  <div className="text-center text-sm text-muted-foreground">
                      ━━━━━━━━━ OR ━━━━━━━━━
                  </div>
                  <Button 
                      variant="secondary"
                      className="w-full max-w-sm"
                      onClick={() => {
                        setManualVerification(false);
                        selfForm.reset();
                        setQR(false);
                      }}
                  >
                      Scan Self.xyz app QR Code
                  </Button>
                  <div className="text-xs text-muted-foreground text-center">
                      Switch to self.xyz verification
                  </div>
              </div>
              </>
            )
            :(
              <>
                <div className="flex flex-col gap-2 pb-0">
                    <div>
                        {qr && (
                          <>
                            <div className="flex flex-col items-center gap-8">
                              <SelfQRcode
                                  selfApp={selfApp}
                                  onSuccess={async () => {
                                      // Handle successful verification
                                      console.log("Verification successful!");
                                      // Redirect or update UI
                                      try {
                                        setLoading(true);
                                        const values = selfForm.getValues();
                                        const updateLiquidityProvider = await updateLiquidityProviderAction(
                                          address!,
                                          values.firstname,
                                          values.othername,
                                          values.lastname,
                                          ["self.xyz"],
                                          "self.xyz"
                                        );
                                        if (updateLiquidityProvider) {
                                          await sendVerifySelfMail(
                                            liquidityProvider.email,
                                            values.firstname
                                          )
                                          await sendVerifySelfAdminMail(
                                            values.firstname,
                                            values.othername,
                                            values.lastname
                                          )
                                          toast.success("KYC Completed", {
                                            description: "Our Team will review your KYC and get back to you shortly",
                                          })
                                          setLoading(false);
                                          getLiquidityProviderSync();
                                        } else {
                                          toast.error("KYC Failed", {
                                            description: `Something went wrong, please try again`,
                                          })
                                          setLoading(false);
                                        }
                                      } catch (error) {
                                        toast.error("KYC Failed", {
                                          description: `Something went wrong, please try again`,
                                        })
                                        setLoading(false);
                                      }
                                  }}
                                  onError={() => {
                                      // Handle verification error
                                      console.log("Verification error!");
                                  }}
                                  size={200}
                              />
                              <Button
                                variant="outline"
                                className="w-full"
                                disabled={loading}
                                onClick={() => {
                                  setQR(false);
                                  setLoading(false);
                                }}
                              >
                                {
                                  loading
                                  ? <Loader2 className="w-4 h-4 animate-spin" />
                                  : <Undo2   />
                                }
                                {
                                  loading
                                  ? <p>Saving...</p>
                                  : <p>Edit Name</p>
                                }
                                
                              </Button>
                            </div>
                          </>
                        )}
                        {
                          !qr && (
                            <>
                              <div className="flex flex-col p-4">
                                <Form {...selfForm}>
                                  <form onSubmit={selfForm.handleSubmit(onSubmitSelf)} className="space-y-6">
                                    <FormField
                                      control={selfForm.control}
                                      name="firstname"
                                      render={({ field }) => (
                                          <FormItem>
                                              <div className="flex flex-col gap-1 w-full max-w-sm space-x-2">
                                                  <FormLabel className="text-yellow-600">First Name</FormLabel>
                                                  <FormControl >
                                                      <Input 
                                                        autoComplete="off" 
                                                          disabled={ !!liquidityProvider.firstname || loading } 
                                                        className="col-span-3" 
                                                        placeholder={liquidityProvider.firstname ? liquidityProvider.firstname.toUpperCase() : "VITALIK"}
                                                        {...field}
                                                        onChange={(e) => {
                                                          field.onChange(e.target.value.toUpperCase())
                                                        }}
                                                      />
                                                  </FormControl>
                                              </div>
                                          </FormItem>
                                      )}
                                    />
                                    <FormField
                                        control={selfForm.control}
                                        name="othername"
                                        render={({ field }) => (
                                            <FormItem>
                                                <div className="flex flex-col gap-1 w-full max-w-sm space-x-2">
                                                    <FormLabel className="text-yellow-600">Other Name(s)</FormLabel>
                                                    <FormControl >
                                                        <Input 
                                                          autoComplete="off" 
                                                          disabled={ !!liquidityProvider.othername || loading } 
                                                          className="col-span-3" 
                                                          placeholder={liquidityProvider.othername ? liquidityProvider.othername.toUpperCase() : "DOTETH"} 
                                                          {...field}
                                                          onChange={(e) => {
                                                            field.onChange(e.target.value.toUpperCase())
                                                          }}
                                                        />
                                                    </FormControl>
                                                </div>
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={selfForm.control}
                                        name="lastname"
                                        render={({ field }) => (
                                            <FormItem>
                                                <div className="flex flex-col gap-1 w-full max-w-sm space-x-2">
                                                    <FormLabel className="text-yellow-600">Last Name</FormLabel>
                                                    <FormControl >
                                                        <Input 
                                                          autoComplete="off" 
                                                          disabled={ !!liquidityProvider.lastname || loading } 
                                                          className="col-span-3" 
                                                          placeholder={liquidityProvider.lastname ? liquidityProvider.lastname.toUpperCase() : "BUTERIN"} 
                                                          {...field}
                                                          onChange={(e) => {
                                                            field.onChange(e.target.value.toUpperCase())
                                                          }}
                                                        />
                                                    </FormControl>
                                                </div>
                                            </FormItem>
                                        )}
                                    />
                                    
                                    <div className="flex">
                                        <Button
                                            className="w-full"
                                            disabled={loading || liquidityProvider.national.length > 0}
                                            type="submit"
                                        >
                                            {
                                                loading
                                                ? <Loader2 className="w-4 h-4 animate-spin" />
                                                : (
                                                  liquidityProvider.national.length > 0
                                                  ? <Hourglass />
                                                  : <Camera />
                                                )
                                            }
                                            {
                                              liquidityProvider.national.length > 0
                                              ? <p>KYC Review Pending...</p>
                                              : <p>Scan Self.xyz QR</p>
                                            }
                                        </Button>
                                    </div>
                                  </form>
                                </Form>
                              </div>  
                            </>
                          )
                        }
                        <div className="flex flex-col items-center gap-2 mt-4 mb-2">
                            <div className="text-center text-sm text-muted-foreground">
                                ━━━━━━━━━ OR ━━━━━━━━━
                            </div>
                            <Button 
                                variant="secondary"
                                className="w-full max-w-sm"
                                onClick={() => {
                                  setManualVerification(true);
                                  manualForm.reset();
                                  setUpload(false);
                                }}
                            >
                                Upload ID Documents Instead
                            </Button>
                            <div className="text-xs text-muted-foreground text-center">
                                Switch to manual document verification
                            </div>
                        </div>
                    </div>
                </div>
              </>
            )
          }
                      
        </div>
      </DrawerContent>
    </Drawer>
  );
}