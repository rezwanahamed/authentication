"use client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { IPasskey } from "@/types/interface";
import { QrCode } from "lucide-react";
import QRCode from "react-qr-code";

const QrDialog = ({ passkeys }: { passkeys: IPasskey[] }) => {
  return (
    <div>
      <Dialog>
        <DialogTrigger>
          <div className="qr-button flex h-10 justify-center rounded bg-[#233856] p-2 text-blue-500">
            <QrCode />
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
                value={`${passkeys}`}
                viewBox={`0 0 256 256`}
              />
            </div>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default QrDialog;
