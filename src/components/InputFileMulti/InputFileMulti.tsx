import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
import React, { useState } from "react";
import { useFormContext, FieldValues } from "react-hook-form";

interface FileInputMultiProps {
  name: string;
  label: string;
  accept?: string;
  multiple?: boolean;
}

const FileInputMulti = ({
  name,
  label,
  accept = "*/*",
  multiple = false,
}: FileInputMultiProps) => {
  const {
    setValue,
    watch,
    formState: { errors },
  } = useFormContext<FieldValues>();

  const watchedFiles = watch(name) as File[] | File | undefined;
  const [previews, setPreviews] = useState<string[]>([]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files || []);

    let updatedFiles: File[] = [];

    if (multiple && watchedFiles && Array.isArray(watchedFiles)) {
      updatedFiles = [...watchedFiles, ...selectedFiles];
    } else {
      updatedFiles = selectedFiles;
    }

    setValue(name, multiple ? updatedFiles : updatedFiles[0], {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    });

    const newPreviews = updatedFiles.map((file) =>
      file.type?.startsWith("image/") ? URL.createObjectURL(file) : ""
    );
    setPreviews(newPreviews);
  };

  const handleRemove = (indexToRemove: number) => {
    if (!multiple || !Array.isArray(watchedFiles)) return;

    const updatedFiles = watchedFiles.filter((_, i) => i !== indexToRemove);
    const updatedPreviews = previews.filter((_, i) => i !== indexToRemove);

    setValue(name, updatedFiles, {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    });
    setPreviews(updatedPreviews);
  };

  const files = multiple
    ? (watchedFiles as File[]) || []
    : watchedFiles
      ? [watchedFiles as File]
      : [];

  return (
    <div className="flex space-y-2 mb-4">
      <label
        htmlFor={name}
        className={`font-medium cursor-pointer ${errors[name] ? "text-red-600" : ""}`}
      >
        {label}
        <FuseSvgIcon
          color={files.length > 0 ? "success" : "inherit"}
          size={50}
          className="mt-4"
        >
          {files.length > 0
            ? "heroicons-outline:document-check"
            : "heroicons-outline:document-plus"}
        </FuseSvgIcon>
      </label>

      <input
        id={name}
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={handleChange}
        className="hidden"
      />

      {errors[name] && (
        <span className="text-red-600 text-sm">
          {errors[name]?.message as string}
        </span>
      )}

      {files.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-4">
          {files.map((file, index) => (
            <div
              key={index}
              className="relative w-24 flex-shrink-0 flex flex-col items-center text-center"
            >
              <button
                type="button"
                onClick={() => handleRemove(index)}
                className="absolute -top-2 -right-2 bg-white text-red-500 border border-red-300 rounded-full w-5 h-5 flex items-center justify-center shadow"
                title="Remove file"
              >
                ×
              </button>

              {file.type?.startsWith("image/") && previews[index] ? (
                <img
                  src={previews[index]}
                  alt={file.name}
                  className="w-24 h-24 object-cover border rounded"
                />
              ) : (
                <div className="w-24 h-24 flex items-center justify-center border rounded bg-gray-100 text-xs p-1 text-center">
                  {file.name}
                </div>
              )}
              <div className="text-xs mt-1 break-words max-w-[96px]">
                {file.name}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FileInputMulti;
