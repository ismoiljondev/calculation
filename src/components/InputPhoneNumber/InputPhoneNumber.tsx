import React, { FC, useEffect, useRef } from "react";
import { Controller, useFormContext } from "react-hook-form";
import {
  PhoneInput,
  usePhoneInput,
  CountryIso2,
} from "react-international-phone";
import { PhoneNumberUtil } from "google-libphonenumber";
import _ from "lodash";
import "react-international-phone/style.css";

const phoneUtil = PhoneNumberUtil.getInstance();

const validatePhone = (phone: string) => {
  try {
    return phoneUtil.isValidNumber(phoneUtil.parseAndKeepRawInput(phone));
  } catch {
    return false;
  }
};

interface InputPhoneNumberProps {
  name: string;
  label: string;
  required?: boolean;
  className?: string;
  size?: "small" | "middle" | "large";
  defaultCountry?: CountryIso2;
  disabled?: boolean;
}

const InputPhoneNumber: FC<InputPhoneNumberProps> = ({
  name,
  className,
  defaultCountry = "uz",
  disabled = false,
}) => {
  const {
    control,
    formState: { errors },
    setValue,
  } = useFormContext();

  const inputRef = useRef<HTMLInputElement>(null);
  const { phone } = usePhoneInput({ defaultCountry });

  const error = !!_.get(errors, name);
  const helperText = error ? (_.get(errors, name)?.message as string) : "";

  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      e.preventDefault();
      const pasted = e.clipboardData?.getData("text");
      if (pasted && inputRef.current) {
        const formatted = pasted.slice(-9); // only last 9 digits
        setValue(name, phone.concat(formatted));
      }
    };

    const input = inputRef.current;
    if (input) input.addEventListener("paste", handlePaste);
    return () => input?.removeEventListener("paste", handlePaste);
  }, [name, phone, setValue]);

  return (
    <>
      <Controller
        name={name}
        control={control}
        rules={{
          validate: {
            validPhone: (value) =>
              validatePhone(value) || "Invalid phone number",
          },
        }}
        render={({ field }) => (
          <PhoneInput
            {...field}
            inputRef={inputRef}
            defaultCountry={defaultCountry}
            disabled={disabled}
            className="w-full "
          />
        )}
      />
      {error && <p className="mt-1 text-sm text-red-500">{helperText}</p>}
    </>
  );
};

export default InputPhoneNumber;
