import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import _ from "lodash";
import Button from "@mui/material/Button";
import { useTranslation } from "react-i18next";
import { useAppDispatch } from "@/store/hooks";
import { useNavigate } from "react-router";
import { showMessage } from "@fuse/core/FuseMessage/fuseMessageSlice";
import { queryClient } from "@/app/App";
import useBlockerInForm from "@/hooks/useBlockerInForm";
import { useState } from "react";
import { CircularProgress } from "@mui/material";
import { ProductFormType, productSchema } from "../schema";
import Inputs from "./Inputs";
import {
  getProductTypeControllerFindAllQueryKey,
  useProductTypeControllerCreate,
  useProductVariantControllerCreate,
} from "@/api/api";
import {
  CreateProductTypeDto,
  CreateProductVariantDto,
} from "@/api/api.schemas";

function AddNewProductTypes() {
  const { t } = useTranslation("branches");
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);
  const methods = useForm<ProductFormType>({
    mode: "onChange",
    resolver: zodResolver(productSchema),
  });
  useBlockerInForm(methods.control);

  const { mutateAsync } = useProductVariantControllerCreate();
  const navigate = useNavigate();

  async function onSubmit(formData: ProductFormType) {
    if (loading) return;

    setLoading(true);
    try {
      const Payload: CreateProductVariantDto = {
        name: formData?.name,
        type: formData?.type,
        unit: formData?.unit,
      };

      await mutateAsync({ data: Payload });
      dispatch(
        showMessage({
          message: t("successfully_edited", { ns: "general" }),
          variant: "success",
        })
      );
      navigate(`/products`);
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
        name="addBranchForm"
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
          onClick={() => console.log(methods?.formState?.errors)}
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

export default AddNewProductTypes;
