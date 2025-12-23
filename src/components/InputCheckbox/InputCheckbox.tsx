import React from "react";
import { Controller, useFormContext } from "react-hook-form";
import { Checkbox, FormControlLabel, CheckboxProps } from "@mui/material";

interface InputCheckboxProps extends Omit<CheckboxProps, "name"> {
  name: string;
  label: string;
}

const InputCheckbox: React.FC<InputCheckboxProps> = ({
  name,
  label,
  ...rest
}) => {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <FormControlLabel
          control={
            <Checkbox
              {...field}
              checked={!!field.value}
              onChange={(e) => field.onChange(e.target.checked)}
              {...rest}
            />
          }
          label={label}
        />
      )}
    />
  );
};

InputCheckbox.displayName = "InputCheckbox";
export default InputCheckbox;
