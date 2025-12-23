import {
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  Radio,
  RadioGroup,
} from "@mui/material";
import React from "react";
import { Controller, useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";

interface InputRadioProps {
  label: string;
  name: string;
  defaultValue?: string | number;
  items: Array<{
    label: string;
    value: string | number;
  }>;
}

const InputRadio: React.FC<InputRadioProps> = ({ label, name, items }) => {
  const { control, formState } = useFormContext();
  const { t } = useTranslation("general");

  return (
    <FormControl component="fieldset" sx={{ mb: 3 }}>
      <FormLabel id={`radio-buttons-group-label-${name}`} component="legend">
        {label}
      </FormLabel>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <RadioGroup
            value={field.value ?? ""}
            onChange={field.onChange}
            aria-labelledby={`radio-buttons-group-label-${name}`}
            row
          >
            {items.map((item, index) => (
              <FormControlLabel
                key={index}
                value={item.value}
                control={<Radio />}
                label={item.label}
              />
            ))}
          </RadioGroup>
        )}
      />
      {formState.errors[name] && (
        <FormHelperText error>{t("required_field")}</FormHelperText>
      )}
    </FormControl>
  );
};

InputRadio.displayName = "InputRadio";
export default InputRadio;
