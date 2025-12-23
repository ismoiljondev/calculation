import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import React, { useState, useCallback, ChangeEvent, useEffect } from "react";
import Cropper, { Area } from "react-easy-crop";
import { useFormContext, FieldValues, useWatch } from "react-hook-form";
import { useTranslation } from "react-i18next";

interface ImageCropperProps {
  name: string;
  aspectRatio?: number;
  label: string;
}

const ImageCropper = ({ name, aspectRatio = 1, label }: ImageCropperProps) => {
  const { register, setValue, formState, control } =
    useFormContext<FieldValues>();
  const { t } = useTranslation("general");
  const defaultImage = useWatch({ control, name });

  const [imageSrc, setImageSrc] = useState<string | null>(
    defaultImage || "/assets/images/etc/default-image.png"
  );

  const [crop, setCrop] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState<number>(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [croppedImageUrl, setCroppedImageUrl] = useState<string | null>(
    defaultImage || "/assets/images/etc/default-image.png"
  );

  useEffect(() => {
    if (defaultImage && !(defaultImage instanceof Blob)) {
      const imgUrl =
        typeof defaultImage === "number"
          ? `${import.meta.env.VITE_API_BASE_URL}/file/api/file/${defaultImage}`
          : defaultImage;
      setImageSrc(imgUrl);
      setCroppedImageUrl(imgUrl);
      // optional: setValue(name, defaultImage) <-- agar kerak bo‘lsa
    }
  }, [defaultImage]);

  const onCropComplete = useCallback(
    (_croppedArea: Area, croppedAreaPixels: Area) => {
      setCroppedAreaPixels(croppedAreaPixels);
    },
    []
  );

  const onSelectFile = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const imageDataUrl = await readFile(file);
      setImageSrc(imageDataUrl);
      setIsModalOpen(true);
    }
  };

  const readFile = (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.addEventListener("load", () => resolve(reader.result as string));
      reader.readAsDataURL(file);
    });
  };

  const handleDone = async () => {
    if (imageSrc && croppedAreaPixels) {
      try {
        const blob = await getCroppedImg(imageSrc, croppedAreaPixels);
        const url = URL.createObjectURL(blob);
        setCroppedImageUrl(url);
        setValue(name, blob, {
          shouldValidate: true,
          shouldDirty: true,
          shouldTouch: true,
        }); // store the image in the form
        setIsModalOpen(false);
      } catch (e) {
        console.error("Crop failed", e);
      }
    }
  };

  return (
    <div className="p-4 inline-block">
      <input
        id="image-input"
        type="file"
        accept="image/*"
        {...register(name)}
        onChange={onSelectFile}
        className="mb-4 hidden"
      />

      <label htmlFor="image-input" className="cursor-pointer">
        <span className="inline-block mb-4 font-semibold">{label}:</span>
        {croppedImageUrl && (
          <div className="w-40 h-40 overflow-hidden rounded border">
            <img
              src={croppedImageUrl}
              alt="Cropped Preview"
              className="object-cover w-full h-full"
            />
          </div>
        )}
      </label>
      <span className="text-red-500">
        {formState.errors &&
          formState.errors[name] &&
          (formState.errors[name].message as string)}
      </span>
      <Dialog
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>{t("crop_image")}</DialogTitle>
        <DialogContent>
          <div className="relative w-full h-96 bg-gray-200">
            {imageSrc && (
              <Cropper
                image={imageSrc}
                crop={crop}
                zoom={zoom}
                aspect={aspectRatio}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
              />
            )}
          </div>
        </DialogContent>
        <DialogActions>
          <Button color="primary" onClick={() => setIsModalOpen(false)}>
            {t("cancel")}
          </Button>
          <Button color="secondary" variant="contained" onClick={handleDone}>
            {t("done")}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ImageCropper;

export function getCroppedImg(
  imageSrc: string,
  pixelCrop: Area
): Promise<Blob> {
  const canvas = document.createElement("canvas");
  const image = new Image();
  image.src = imageSrc;

  return new Promise((resolve, reject) => {
    image.onload = () => {
      canvas.width = pixelCrop.width;
      canvas.height = pixelCrop.height;
      const ctx = canvas.getContext("2d");

      if (!ctx) return reject(new Error("Canvas context is null"));

      ctx.drawImage(
        image,
        pixelCrop.x,
        pixelCrop.y,
        pixelCrop.width,
        pixelCrop.height,
        0,
        0,
        pixelCrop.width,
        pixelCrop.height
      );

      canvas.toBlob((blob) => {
        if (!blob) return reject(new Error("Canvas is empty"));
        resolve(blob);
      }, "image/jpeg");
    };
    image.onerror = reject;
  });
}
