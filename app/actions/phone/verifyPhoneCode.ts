"use server";

// Download the helper library from https://www.twilio.com/docs/node/install
import twilio from "twilio";

// Find your Account SID and Auth Token at twilio.com/console
// and set the environment variables. See http://twil.io/secure
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

export async function verifyPhoneCode( code: string, phoneNumber: string ) {
  const verificationCheck = await client.verify.v2
    .services(process.env.TWILIO_SERVICE_SID)
    .verificationChecks.create({
      code: code,
      to: phoneNumber,
    });

  console.log(verificationCheck.status);
}
