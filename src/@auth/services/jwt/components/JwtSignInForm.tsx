import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import _ from "lodash";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import useJwtAuth from "../useJwtAuth";
import { FetchApiError } from "@/utils/apiFetch";
import { JwtSignInPayload } from "../JwtAuthProvider";
import { useSnackbar } from "notistack";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

/**
 * Form Validation Schema
 */
const schema = z.object({
  username: z.string().min(6, "Login 6 belgidan ko'p bo'lishi kerak"),
  password: z
    .string()
    .min(4, "Parol juda qisqa - kamida 4 belgi bo'lishi kerak."),
  client_id: z.string().optional(),
  grant_type: z.string().optional(),
  client_secret: z.string().optional(),
  scope: z.string().optional(),
});

type FormType = JwtSignInPayload & {
  remember?: boolean;
};

const defaultValues: JwtSignInPayload = {
  // client_id: "survey",
  // grant_type: "password",
  // client_secret: import.meta.env.VITE_KEYCLOACK_CLIENT_SECRET as string,
  // scope: "openid",
  username: "",
  password: "",
};

function JwtSignInForm() {
  const { signIn } = useJwtAuth();
  const { enqueueSnackbar } = useSnackbar();
  const { t } = useTranslation("general");
  const { control, formState, handleSubmit, setError } = useForm<FormType>({
    mode: "onChange",
    defaultValues,
    resolver: zodResolver(schema),
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleTogglePassword = () => {
    setShowPassword((prev) => !prev);
  };
  const { isValid, dirtyFields, errors } = formState;

  function onSubmit(formData: FormType) {
    const { username, password } = formData;

    signIn({
      ...formData,
      username,
      password,
    })
      .then(() => {
        window.location.reload();
      })
      .catch((error: FetchApiError) => {
        const errorData = error.data as {
          type: "login" | "password" | `root.${string}` | "root";
          message: string;
        }[];
        if (!errorData?.length) {
          const msg = t("login_fail");
          setError("root", { type: "manual", message: msg });
          enqueueSnackbar(msg, { variant: "error" });
          return;
        }

        errorData.forEach((err) => {
          setError(err.type as any, {
            type: "manual",
            message: err.message,
          });
          // // Show toast for each field error or general error
          // if (err.type === "root" || err.type?.startsWith("root.")) {
          //   enqueueSnackbar(err.message, { variant: "error" });
          // }
        });
      });
  }

  return (
    <form
      name="loginForm"
      noValidate
      className="mt-8 flex w-full flex-col justify-center"
      onSubmit={handleSubmit(onSubmit)}
    >
      <Controller
        name="username"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            className="mb-6"
            label="Login"
            autoFocus
            type="text"
            error={!!errors.username}
            helperText={errors?.username?.message}
            variant="outlined"
            required
            fullWidth
          />
        )}
      />

      <Controller
        name="password"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            className="mb-6"
            label="Parol"
            type={showPassword ? "text" : "password"}
            error={!!errors.password}
            helperText={errors?.password?.message}
            variant="outlined"
            required
            fullWidth
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handleTogglePassword} edge="end">
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        )}
      />
      {errors.root && (
        <div className="text-red-600 text-sm">{errors.root.message}</div>
      )}
      <Button
        variant="contained"
        color="secondary"
        className=" mt-4 w-full"
        aria-label="Sign in"
        disabled={_.isEmpty(dirtyFields) || !isValid}
        type="submit"
        size="large"
      >
        {t("login")}
      </Button>
    </form>
  );
}

export default JwtSignInForm;
