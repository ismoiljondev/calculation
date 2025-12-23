import { TextFieldProps } from "@mui/material";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { Controller, useFormContext } from "react-hook-form";
import React from "react";
import _ from "lodash";
import dayjs from "dayjs";

interface InputTimeProps extends Omit<TextFieldProps, "name" | "label"> {
    name: string;
    label: string;
    className?: string;
}

const InputTime: React.FC<InputTimeProps> = ({
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
                <TimePicker
                    ampm={false} // 24-hour format
                    value={
                        field.value && dayjs(field.value).isValid()
                            ? new Date(field.value)
                            : null
                    }
                    onChange={(date: Date | null) => {
                        field.onChange(date ? date.toISOString() : null);
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

InputTime.displayName = "InputTime";
export default InputTime;
