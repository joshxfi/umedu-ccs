import { twMerge } from "tailwind-merge";
import { domToPng } from "modern-screenshot";
import { clsx, type ClassValue } from "clsx";
import { format } from "date-fns";
import { toast } from "sonner";
import { nanoid } from "nanoid";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatDate = (date: Date) => {
  return format(date, "MMM d, yyyy 'at' h:mm a");
};

export const truncateContent = (content: string, maxLength = 100) => {
  if (content.length <= maxLength) return content;
  return content.slice(0, maxLength) + "...";
};

export const getBaseUrl = () => {
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  return "http://localhost:3000";
};

export const saveImage = (id: string) => {
  const target = document.querySelector(`#${id}`);

  if (!target) {
    toast.error("An error occured");
    return;
  }

  toast.promise(
    domToPng(target, {
      quality: 1,
      scale: 4,
      backgroundColor: "#09090B",
    })
      .then((dataUrl) => {
        const link = document.createElement("a");
        link.download = `umedu-ccs-${nanoid(5)}.png`;
        link.href = dataUrl;
        link.click();
      })
      .catch((err) => {
        console.log(err);
      }),
    {
      loading: "Saving...",
      success: "Download ready",
      error: "An error occured!",
    },
  );
};
