import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import _ from "lodash";
import Button from "@mui/material/Button";
import { useTranslation } from "react-i18next";

import { useAppDispatch } from "@/store/hooks";
import { useNavigate } from "react-router";
import { showMessage } from "@fuse/core/FuseMessage/fuseMessageSlice";
import { queryClient } from "@/app/App";
import Inputs from "../components/Inputs";
import { ContactFormType, contactSchema } from "../schema";
import useBlockerInForm from "@/hooks/useBlockerInForm";
import { useState } from "react";
import { CircularProgress, Paper } from "@mui/material";
import {
  getContactControllerFindAllQueryKey,
  useContactControllerCreate,
} from "@/api/api";
import { CreateContactDto } from "@/api/api.schemas";

function AddNewData() {
  const { t } = useTranslation("contact");
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);
  const methods = useForm<ContactFormType>({
    mode: "onChange",
    resolver: zodResolver(contactSchema),
  });
  useBlockerInForm(methods.control);

  const { mutateAsync } = useContactControllerCreate();
  const navigate = useNavigate();

  async function onSubmit(formData: ContactFormType) {
    if (loading) return;

    setLoading(true);
    try {
      const Payload: CreateContactDto = {
        name: formData.name,
        phone: formData?.phone,
      };

      await mutateAsync({ data: Payload });
      dispatch(
        showMessage({
          message: t("successfully_created", { ns: "general" }),
          variant: "success",
        })
      );
      navigate("/contact");
      queryClient.invalidateQueries({
        queryKey: getContactControllerFindAllQueryKey(),
      });
    } catch (err) {
      dispatch(
        showMessage({
          message: t("error_creation", { ns: "general" }),
          variant: "error",
        })
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <Paper className="border p-4 rounded-lg space-y-2">
      <FormProvider {...methods}>
        <form
          name="addLoanForm"
          noValidate
          className="my-8 flex w-full flex-col gap-4 justify-center"
          onSubmit={methods.handleSubmit(onSubmit)}
        >
          <Inputs />
          <Button
            variant="contained"
            color="secondary"
            aria-label="Save"
            // disabled={_.isEmpty(dirtyFields) || !isValid}
            type="submit"
            size="large"
            fullWidth
            disabled={loading}
            startIcon={
              loading ? <CircularProgress size={20} color="inherit" /> : null
            }
          >
            {loading
              ? t("loading", { ns: "general" })
              : t("save", { ns: "general" })}
          </Button>
        </form>
      </FormProvider>
    </Paper>
  );
}

export default AddNewData;
