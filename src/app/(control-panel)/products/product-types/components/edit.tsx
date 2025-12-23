import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import _ from "lodash";
import Button from "@mui/material/Button";
import { useTranslation } from "react-i18next";
import { useAppDispatch } from "@/store/hooks";
import { useNavigate, useParams } from "react-router";
import { showMessage } from "@fuse/core/FuseMessage/fuseMessageSlice";
import { queryClient } from "@/app/App";
import { useEffect, useState } from "react";
import useBlockerInForm from "@/hooks/useBlockerInForm";
import { CircularProgress } from "@mui/material";
import { ProductTypesFormType, productTypesSchema } from "../schema";
import Inputs from "./Inputs";
import { format } from "date-fns";
import {
  getProductTypeControllerFindAllQueryKey,
  useProductTypeControllerFindOne,
  useProductTypeControllerUpdate,
} from "@/api/api";
import { UpdateProductTypeDto } from "@/api/api.schemas";

function EditProductTypes() {
  const { t } = useTranslation("products");
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const { data } = useProductTypeControllerFindOne(id as unknown as string);
  const [loading, setLoading] = useState(false);
  const methods = useForm<ProductTypesFormType>({
    mode: "onChange",
    resolver: zodResolver(productTypesSchema),
  });
  useBlockerInForm(methods.control);

  useEffect(() => {
    if (data) {
      methods.reset({
        name: data?.name,
      });
    }
  }, [data, methods.reset]);

  const { mutateAsync } = useProductTypeControllerUpdate();
  const navigate = useNavigate();

  async function onSubmit(formData: ProductTypesFormType) {
    if (loading) return;

    setLoading(true);
    try {
      const Payload: UpdateProductTypeDto = {
        ...formData,
      };

      await mutateAsync({
        data: Payload,
        id: id,
      });

      dispatch(
        showMessage({
          message: t("successfully_edited", { ns: "general" }),
          variant: "success",
        })
      );
      navigate(`/product-types`);
      queryClient.invalidateQueries({
        queryKey: getProductTypeControllerFindAllQueryKey(),
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
        name="editBranch"
        noValidate
        className="my-8 flex w-full flex-col justify-center"
        onSubmit={methods.handleSubmit(onSubmit)}
      >
        <Inputs />
        <Button
          variant="contained"
          color="secondary"
          aria-label="Save"
          type="submit"
          size="large"
          fullWidth
          disabled={loading}
          onClick={(e) => console.log(methods?.formState?.errors)}
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

export default EditProductTypes;
