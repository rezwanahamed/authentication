"use client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { QrCode } from "lucide-react";
import QRCode from "react-qr-code";

const DashboardQrDialog = () => {
  return (
    <div>
      <Dialog>
        <DialogTrigger>
          <div className="logo flex h-12 w-12 items-center justify-center rounded-full bg-[#233856]">
            <QrCode className="h-6 w-6 text-blue-500" />
          </div>
        </DialogTrigger>
        <DialogContent className="w-[18rem] border-2 bg-black">
          <DialogTitle className="font-geist_mono text-sm">
            Scan the QR
          </DialogTitle>
          <DialogHeader className="">
            <div
              style={{
                height: "auto",
                margin: "0 auto",
                maxWidth: 350,
                width: "100%",
              }}
            >
              <QRCode
                size={256}
                style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                value={
                  "sdsasdjkaskjlfasjkldklj;askdlasl;kdakls;dl;ksakl;dsakl;dsakl;adskl;dsakl;"
                }
                viewBox={`0 0 256 256`}
              />
            </div>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DashboardQrDialog;
