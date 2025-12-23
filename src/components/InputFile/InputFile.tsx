import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
import React from "react";
import { useFormContext, FieldValues } from "react-hook-form";

interface FileInputProps {
  name: string;
  label: string;
  accept?: string;
  multiple?: boolean;
  required?: boolean;
}

const FileInput = ({
  name,
  label,
  accept = "*/*",
  multiple = false,
  required = false,
}: FileInputProps) => {
  const {
    setValue,
    watch,
    formState: { errors },
  } = useFormContext<FieldValues>();

  const files: File[] | File | undefined = watch(name);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = event.target.files;
    if (selectedFiles) {
      setValue(name, multiple ? Array.from(selectedFiles) : selectedFiles[0], {
        shouldValidate: true,
        shouldDirty: true,
        shouldTouch: true,
      });
    }
  };

  return (
    <div className="flex flex-col space-y-2 mb-4 cursor-pointer">
      <label
        htmlFor={name}
        className={`font-medium cursor-pointer ${!!errors[name] && "text-red-600"}`}
      >
        {`${label} ${required ? "*" : ""}`}
        <FuseSvgIcon
          color={!!files ? "success" : "inherit"}
          size={50}
          className="mt-4"
        >
          {!!files
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
        className={`border p-2 ${!!errors[name] && "border-red-600 text-red-600"} hidden`}
      />
      {errors[name] && (
        <span className="text-red-600 text-sm">
          {errors[name]?.message as string}
        </span>
      )}

      {files && (
        <div className="mt-2 text-sm text-gray-700">
          {multiple && Array.isArray(files)
            ? files.map((file, idx) => <div key={idx}>{file.name}</div>)
            : (files as File).name}
        </div>
      )}
    </div>
  );
};

export default FileInput;
