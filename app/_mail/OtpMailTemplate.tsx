import {
  Body,
  Container,
  Head,
  Html,
  Preview,
  Text,
} from "@react-email/components";
import { ShieldPlus } from "lucide-react";

const OtpEmailTemplate = ({ otp }: { otp: string }) => (
  <Html>
    <Head>
      <link
        href="https://api.fontshare.com/v2/css?f[]=satoshi@300,301,400,401,500,501,700,701,900,901&display=swap"
        rel="stylesheet"
      />
    </Head>
    <Preview>Your OTP Code</Preview>
    <Body className="bg-[#0a0a0a]">
      <Container className="mx-auto mt-10 w-[20rem] p-6 lg:w-[30rem]">
        <div className="logo mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-[#233856]">
          <ShieldPlus className="h-6 w-6 text-blue-500" />
        </div>
        <Text style={headerText}>Your OTP Code</Text>
        <Text style={text}>
          Use the following code to complete your login:
        </Text>
        <Text style={otpText}>{otp}</Text>

        <Text style={footerText}>
          Use the OTP to verify your account. Please do not share the OTP with
          others.
        </Text>
      </Container>
    </Body>
  </Html>
);

const headerText = {
  color: "white",
  fontSize: "20px",
  fontWeight: "600",
  fontFamily: "'Satoshi', sans-serif",
  marginBottom: "0",
  lineHeight: "0",
  paddingTop: "20px",
};

const text = {
  color: "#9ca3af",
  fontSize: "16px",
  fontWeight: "500",
  fontFamily: "'Satoshi', sans-serif",
};

const otpText = {
  color: "#3b82f6",
  fontSize: "32px",
  fontWeight: "bold",
  marginBottom: "30px",
  fontFamily: "'Satoshi', sans-serif",
};

const footerText = {
  ...text,
  width: "20rem",
};

export default OtpEmailTemplate;