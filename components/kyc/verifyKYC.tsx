"use client"


import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger, DrawerDescription } from "@/components/ui/drawer"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { CloudUpload, Hourglass, Loader2, Paperclip, SaveAll, Undo2 } from "lucide-react"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { FileUploader, FileUploaderContent, FileUploaderItem, FileInput } from "@/components/ui/file-upload"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useUploadThing } from "@/hooks/useUploadThing"
import { updateProfileAction } from "@/app/actions/kyc/updateProfileAction"
import { Profile } from "@/hooks/useGetProfile"
import { Label } from "../ui/label"
import dynamic from "next/dynamic"
import { v4 as uuidv4 } from 'uuid';

  


const FormSchema = z.object({
    firstname: z.string(),
    othername: z.string(),
    lastname: z.string(),
    id: z.string(),
})

interface VerifyKYCProps {
  address: `0x${string}`
  profile: Profile
  getProfileSync: () => void
}

// Dynamically import the QR component with no SSR
const QR = dynamic(() => import('./self/qr').then(mod => mod.QR), {
  ssr: false
});

export function VerifyKYC({ address, profile, getProfileSync }: VerifyKYCProps) {

  const [files, setFiles] = useState < File[] | null > (null);
  console.log(files);
  const [maxFiles, setMaxFiles] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [manualVerification, setManualVerification] = useState(false);

  const [userId, setUserId] = useState<string | null>(null);

    useEffect(() => {
        // Generate a user ID when the component mounts
        setUserId(uuidv4());
    }, []);



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
  
  const form = useForm < z.infer < typeof FormSchema >> ({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      firstname: undefined,
      othername: undefined,
      lastname: undefined,
      id: undefined,
    },
  })

  async function onSubmit(values: z.infer < typeof FormSchema > ) {
    setLoading(true);
    try {
      
      console.log(values);
      if(files && files.length > 0) {
        if (values.id === "national" && files.length != 2) {
          toast.error("National ID must have both front and back scans", {
            description: `Please upload both the front and back of your National ID`,
          })
          setLoading(false);
          return;
        } 
        const uploadFiles = await startUpload(files);
          if(uploadFiles) {
            //update profile with files
            const updateProfile = await updateProfileAction(
              address!,
              values.firstname,
              values.lastname,
              values.othername,
              values.id,
              uploadFiles.map((file) => file.ufsUrl)
            );
            if (updateProfile) {
              toast.success("KYC Completed", {
                description: "Our Team will review your KYC and get back to you shortly",
              })
              setLoading(false);
              getProfileSync();
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
                profile.files.length > 0
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
                  ?<>{ "Enter Full Name, Scan & Upload your ID."}</>
                  :<>{"Scan this QR from your Self.xyz app"}</>
                }
              </DrawerDescription>
          </DrawerHeader>
          {
            manualVerification
            ?(
              <>
                <div className="flex flex-col p-4">
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                      <FormField
                        control={form.control}
                        name="firstname"
                        render={({ field }) => (
                            <FormItem>
                                <div className="flex flex-col gap-1 w-full max-w-sm space-x-2">
                                    <FormLabel className="text-yellow-600">First Name</FormLabel>
                                    <FormControl >
                                        <Input disabled={ !!profile.firstname || loading } className="col-span-3" placeholder={profile.firstname ? profile.firstname : "Vitalik"} {...field} />
                                    </FormControl>
                                </div>
                            </FormItem>
                        )}
                      />
                      <FormField
                          control={form.control}
                          name="othername"
                          render={({ field }) => (
                              <FormItem>
                                  <div className="flex flex-col gap-1 w-full max-w-sm space-x-2">
                                      <FormLabel className="text-yellow-600">Other Name(s)</FormLabel>
                                      <FormControl >
                                          <Input disabled={ !!profile.othername || loading } className="col-span-3" placeholder={profile.othername ? profile.othername : "DeSantis"} {...field} />
                                      </FormControl>
                                  </div>
                              </FormItem>
                          )}
                      />
                      <FormField
                          control={form.control}
                          name="lastname"
                          render={({ field }) => (
                              <FormItem>
                                  <div className="flex flex-col gap-1 w-full max-w-sm space-x-2">
                                      <FormLabel className="text-yellow-600">Last Name</FormLabel>
                                      <FormControl >
                                          <Input disabled={ !!profile.lastname || loading } className="col-span-3" placeholder={profile.lastname ? profile.lastname : "Buterin"} {...field} />
                                      </FormControl>
                                  </div>
                              </FormItem>
                          )}
                      />
                      <FormField
                        control={form.control}
                        name="id"
                        render={({ field }) => (
                            <FormItem>
                                <div className="flex flex-col gap-1 w-full max-w-sm space-x-2">
                                    <FormLabel className="text-yellow-600">ID</FormLabel>
                                    {
                                        !profile.id
                                        ?(
                                            <>
                                                <Select 
                                                  onValueChange={(value) => {
                                                    field.onChange(value);
                                                    // Set maxFiles based on the ID type
                                                    if (value === "passport") {
                                                      setMaxFiles(1); // Only front needed
                                                    } else if (value === "national") {
                                                      setMaxFiles(2); // Front and back needed
                                                    }
                                                  }}
                                          
                                                  defaultValue={field.value}
                                                >
                                                    <FormControl>
                                                    <SelectTrigger disabled={loading} className="col-span-3">
                                                        <SelectValue placeholder="Select an ID Type" />
                                                    </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent className="col-span-3">
                                                        <SelectItem value="passport">Passport</SelectItem>
                                                        <SelectItem value="national">National ID</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </>
                                        )
                                        :(
                                            <>
                                                <FormControl>
                                                    <Input disabled className="col-span-3" placeholder={profile.id === "passport" ? "Passport" : "National ID" } {...field} />
                                                </FormControl>
                                            </>
                                        )
                                    }
                                </div>
                            </FormItem>
                        )}
                      />
                      {
                        maxFiles  && ( 
                          <>
                            <div>
                                  {
                                    profile.files.length <= 0
                                    ?(
                                      <>
                                        <Label className="text-yellow-600">Upload ID <span className="text-xs text-muted-foreground">(must be under 1MB)</span></Label>
                                        <div>
                                          <FileUploader
                                            value={files}
                                            onValueChange={setFiles}
                                            dropzoneOptions={{
                                              maxFiles: maxFiles,
                                              maxSize: 1024 * 1024 * 1,
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
                                              <div className="flex items-center justify-center flex-col p-8 w-full ">
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
                                        <div className="text-xs text-muted-foreground text-center">{maxFiles === 1 ? "Upload the Front Photo of your Passport" : "Upload the Front and Back of your National ID"}</div>
                                        
                                      </>
                                    ) 
                                    :(
                                      <>
                                        <Label className="text-yellow-600">Uploaded ID Scans</Label>
                                        <div>
                                        </div>
                                      </>
                                    ) 
                                  }
                                </div>
                          </> 
                        )
                      }
                      <div className="flex justify-between">
                          <Button
                            variant="secondary"
                            className="max-w-sm"
                            onClick={() => setManualVerification(false)}
                          >
                            <Undo2   />
                          </Button>
                          <Button
                              //className="w-36"
                              disabled={loading || profile.files.length > 0}
                              type="submit"
                          >
                              {
                                  loading
                                  ? <Loader2 className="w-4 h-4 animate-spin" />
                                  : (
                                    profile.files.length > 0
                                    ? <Hourglass />
                                    : <SaveAll />
                                  )
                              }
                              {
                                profile.files.length > 0
                                ? <p>KYC Pending...</p>
                                : <p>Save Changes</p>
                              }
                          </Button>
                      </div>
                    </form>
                  </Form>
                </div>  
              </>
            )
            :(
              <>
                <div className="flex flex-col gap-2 p-4 pb-0">
                    <div>
                        <QR userId={userId!} />
                        <div className="flex flex-col items-center gap-2 mt-6 mb-2">
                            <div className="text-center text-sm text-muted-foreground">
                                ━━━━━━━━━ OR ━━━━━━━━━
                            </div>
                            <Button 
                                variant="secondary"
                                className="w-full max-w-sm"
                                onClick={() => setManualVerification(true)}
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