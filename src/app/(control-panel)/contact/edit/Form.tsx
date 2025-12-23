import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import _ from "lodash";
import Button from "@mui/material/Button";
import { useTranslation } from "react-i18next";

import { useAppDispatch } from "@/store/hooks";
import { useNavigate, useParams } from "react-router";
import { showMessage } from "@fuse/core/FuseMessage/fuseMessageSlice";
import { queryClient } from "@/app/App";
import Inputs from "../components/Inputs";
import { ContactFormType, contactSchema } from "../schema";

import { useEffect, useState } from "react";
import { CircularProgress } from "@mui/material";
import {
  getContactControllerFindAllQueryKey,
  useContactControllerFindOne,
  useContactControllerUpdate,
} from "@/api/api";
import { UpdateContactDto } from "@/api/api.schemas";

function EditContact() {
  const { t } = useTranslation("contact");
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const { data } = useContactControllerFindOne(id as unknown as number);
  const [loading, setLoading] = useState(false);
  const methods = useForm<ContactFormType>({
    mode: "onChange",
    resolver: zodResolver(contactSchema),
  });

  useEffect(() => {
    if (data) {
      methods.reset({
        ...data,
      });
    }
  }, [data, methods.reset]);

  const { mutateAsync } = useContactControllerUpdate();
  const navigate = useNavigate();

  async function onSubmit(formData: ContactFormType) {
    if (loading) return;

    setLoading(true);
    try {
      const Payload: UpdateContactDto = {
        name: formData.name,
        phone: formData?.phone,
      };

      await mutateAsync({
        data: Payload,
      });

      dispatch(
        showMessage({
          message: t("successfully_edited", { ns: "general" }),
          variant: "success",
        })
      );
      navigate(`/contact`);
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
    <FormProvider {...methods}>
      <form
        name="addcontactForm"
        noValidate
        className="my-8 flex w-full flex-col justify-center"
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
  );
}

export default EditContact;
