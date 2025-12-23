import { TextField } from "@mui/material";
import React from "react";
import { Controller, useFormContext } from "react-hook-form";
import { NumericFormat, NumericFormatProps } from "react-number-format";

interface InputNumberProps {
  name: string;
  label: string;
  disabled?: boolean;
  rules?: any;
  readOnly?: boolean;
  min?: number;
  decimalScale?: number;
  customOnChange?: () => void;
}


/**
 * Custom wrapper so MUI TextField + react-number-format work nicely with RHF.
 * It emits **floatValue** to RHF, keeping the form state clean (number) while
 * displaying a formatted string such as `1 234 567.89` to the user.
 */
const NumberFormatCustom = React.forwardRef<HTMLInputElement, NumericFormatProps>(
  function NumberFormatCustom(props, ref) {
    const {
      onChange,
      name,
      decimalScale = 2, // we re‑expose this prop via inputProps
      ...other
    } = props as NumericFormatProps & { name: string; decimalScale?: number };

    return (
      <NumericFormat
        {...other}
        getInputRef={ref}
        allowNegative={false}
        thousandSeparator=" " // Uzbek thousands separator
        decimalSeparator="."
        decimalScale={decimalScale}
        fixedDecimalScale={false}
        valueIsNumericString
        onValueChange={({ floatValue }) =>
          onChange?.({
            target: { name, value: floatValue ?? "" },
          } as unknown as React.ChangeEvent<HTMLInputElement>)
        }
      />
    );
  }
);

const InputNumber: React.FC<InputNumberProps> = ({
  name,
  label,
  disabled,
  rules,
  readOnly,
  min,
  decimalScale = 2,
  customOnChange
}) => {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field, fieldState }) => (
        <TextField
          {...field}
          value={field.value ?? ""}
          label={label}
          autoComplete="off"
          error={!!fieldState.error}
          helperText={fieldState.error?.message}
          variant="outlined"
          required
          fullWidth
          disabled={disabled}
          sx={{ mb: 3 }}
          onWheel={(e) => e.currentTarget.blur()}
          onChange={(e) => {
            field.onChange(e);
            customOnChange?.();
          }}
          InputProps={{
            inputComponent: NumberFormatCustom as any,
            inputProps: {
              name,
              decimalScale,
              min,
              readOnly,
              style: { MozAppearance: "textfield" },
            },
            readOnly,
            sx: {
              "& input": {
                MozAppearance: "textfield",
              },
              "& input::-webkit-outer-spin-button": {
                WebkitAppearance: "none",
                margin: 0,
              },
              "& input::-webkit-inner-spin-button": {
                WebkitAppearance: "none",
                margin: 0,
              },
            },
          }}
        />
      )}

    />
  );
};

InputNumber.displayName = "InputNumber";
export default InputNumber;
