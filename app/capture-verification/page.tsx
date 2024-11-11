"use client"
import ReCAPTCHA from "@/components/ui/common/Recaptcha/RecaptchaComponent";

function page() {
    const onCaptureVerify =()=>{
        alert("hello is is a secret")
    }
  return (
    <div>
        <ReCAPTCHA siteKey="whwhwhwhwhhwhw"  onVerify={onCaptureVerify}/>
      <h1>test component</h1>
    </div>
  );
}

export default page;
