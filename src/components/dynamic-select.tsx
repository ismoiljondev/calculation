import React from "react";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { Controller, useFormContext, useWatch } from "react-hook-form";
import { useTranslation } from "react-i18next";
import _ from "lodash";

interface DynamicSelectFieldProps {
  name: string;
  label: string;
  isDisabled?: boolean;
  options: { value: string | number; label: string }[];
}

const DynamicSelectField: React.FC<DynamicSelectFieldProps> = ({
  name,
  label,
  isDisabled = false,
  options,
}) => {
  const { control, formState, setValue } = useFormContext();
  const selectedValue = useWatch({ control, name });
  const { t } = useTranslation("general");

  React.useLayoutEffect(() => {
    if (selectedValue) {
      setValue(name, selectedValue, {
        shouldDirty: true,
        shouldTouch: true,
        shouldValidate: true,
      });
    }
  }, [selectedValue, name, setValue]);
  return (
    <FormControl fullWidth sx={{ mb: 3 }}>
      <InputLabel id={`${name}-select-label`}>{label}</InputLabel>
      <Controller
        name={name}
        control={control}
        render={({ field, formState }) => (
          <Select
            {...field}
            value={field.value ?? ""}
            labelId={`${name}-select-label`}
            id={`${name}-select`}
            label={label}
            disabled={isDisabled}
            error={
              !!formState.errors?.[name] &&
              !!_.get(!!formState.errors?.[name], name.split("."))
            }
          >
            {options.map((item, index) => (
              <MenuItem key={index} value={item.value}>
                {t(item.label)}
              </MenuItem>
            ))}
          </Select>
        )}
      />
      {formState.errors?.[name]?.message && (
        <span className="text-red-500">
          {formState.errors[name]?.message as string}
        </span>
      )}
    </FormControl>
  );
};

DynamicSelectField.displayName = "DynamicSelectField";
export default DynamicSelectField;
