import { TextField, TextFieldProps } from "@mui/material";
import React from "react";
import { Controller, useFormContext } from "react-hook-form";
import _ from "lodash";
import { cn } from "@/utils/classNames";

interface InputTextProps extends Omit<TextFieldProps, "name"> {
  name: string;
  label: string;
  className?: string;
}

const InputText: React.FC<InputTextProps> = ({
  label,
  name,
  className,
  ...rest
}) => {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <TextField
          {...rest}
          {...field}
          value={field.value ?? ""}
          label={label}
          type="string"
          autoComplete="off"
          error={!!errors && !!_.get(errors, name.split("."))}
          helperText={
            !!errors &&
            (_.get(errors, name.split("."))?.message as string as string)
          }
          variant="outlined"
          required
          fullWidth
          className={cn("mb-6", className)}
        />
      )}
    />
  );
};

InputText.displayName = "InputText";
export default InputText;
