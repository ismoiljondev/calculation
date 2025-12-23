import { TextFieldProps } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { Controller, useFormContext } from "react-hook-form";
import React from "react";
import _ from "lodash";
import dayjs from "dayjs";

interface InputDateProps extends Omit<TextFieldProps, "name" | "label"> {
  name: string;
  label: string;
  className?: string;
}

const InputDate: React.FC<InputDateProps> = ({
  name,
  label,
  className,
  ...rest
}) => {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  const error = !!_.get(errors, name);
  const helperText = error ? (_.get(errors, name)?.message as string) : "";

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <DatePicker
          format="dd-MM-yyyy"
          value={
            field.value && dayjs(field.value).isValid()
              ? dayjs(field.value)
              : (null as any)
          }
          onChange={(date) => {
            const isValidDate = date && dayjs(date).isValid();
            field.onChange(isValidDate ? dayjs(date).toDate().toISOString() : null);
          }}
          slotProps={{
            textField: {
              ...rest,
              label,
              error,
              helperText,
              fullWidth: true,
              className,
              sx: { mb: 3, ...rest.sx },
            },
          }}
        />
      )}
    />
  );
};

InputDate.displayName = "InputDate";
export default InputDate;
