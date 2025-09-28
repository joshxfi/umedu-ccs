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

type SaveImageOptions = {
  notify?: boolean;
  fileName?: string;
};

const DEFAULT_BACKGROUND_COLOR = "#09090B";

export const saveImage = async (
  id: string,
  { notify = true, fileName }: SaveImageOptions = {},
): Promise<void> => {
  const target = document.querySelector(`#${id}`) as HTMLElement | null;

  if (!target) {
    if (notify) {
      toast.error("Unable to find the element to capture");
    }
    throw new Error(`Element with id '${id}' not found`);
  }

  const download = domToPng(target, {
    quality: 1,
    scale: 4,
    backgroundColor: DEFAULT_BACKGROUND_COLOR,
    style: {
      scale: "0.9",
      display: "grid",
      placeItems: "center",
    },
  })
    .then((dataUrl) => {
      const link = document.createElement("a");
      link.download = fileName ?? `umedu-ccs-${nanoid(5)}.png`;
      link.href = dataUrl;
      link.click();
    })
    .catch((error) => {
      console.error(error);
      throw error;
    });

  if (!notify) {
    await download;
    return;
  }

  toast.promise(download, {
    loading: "Preparing image...",
    success: "Download ready",
    error: "Failed to download image",
  });
};

const wait = (ms: number) =>
  new Promise<void>((resolve) => {
    setTimeout(resolve, ms);
  });

export const saveImagesBulk = async (ids: string[]) => {
  const uniqueIds = Array.from(new Set(ids)).filter(Boolean);

  if (uniqueIds.length === 0) {
    toast.error("No images available to download");
    return;
  }

  toast.promise(
    (async () => {
      for (const [index, elementId] of uniqueIds.entries()) {
        await saveImage(elementId, {
          notify: false,
          fileName: `${elementId}-${index + 1}.png`,
        });

        // Allow the browser a brief moment between downloads so they are not clobbered.
        await wait(150);
      }
    })(),
    {
      loading: "Preparing downloads...",
      success: `Downloading ${uniqueIds.length} images`,
      error: "Failed to download all images",
    },
  );
};
