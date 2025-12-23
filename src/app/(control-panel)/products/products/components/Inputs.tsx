import _ from "lodash";
import { useTranslation } from "react-i18next";
import InputText from "@/components/InputText";
import DynamicSelectField from "@/components/dynamic-select";
import { useProductTypeControllerFindAll } from "@/api/api";

const Inputs: React.FC = () => {
  const { t } = useTranslation("products");
  const { data } = useProductTypeControllerFindAll();
  const unitOptions = [
    {
      value: `PIECE`,
      label: t("PIECE"),
    },
    {
      value: `METER`,
      label: t("METER"),
    },
    {
      value: `SQUAREMETER`,
      label: t("SQUAREMETER"),
    },
    {
      value: `KILOGRAMM`,
      label: t("KILOGRAMM"),
    },
  ];
  return (
    <>
      <DynamicSelectField
        label={t("type")}
        name="type"
        options={
          data?.data?.map((value) => ({
            value: `${value?.name}`,
            label: `${value?.name}`,
          })) || []
        }
      />
      <InputText key="name" label={t("name")} name="name" />
      <DynamicSelectField
        label={t("unit")}
        name="unit"
        options={
          unitOptions?.map((value) => ({
            value: `${value?.value}`,
            label: `${value?.label}`,
          })) || []
        }
      />
    </>
  );
};

Inputs.displayName = "Inputs";
export default Inputs;
