import _ from "lodash";
import { useTranslation } from "react-i18next";
import InputText from "@/components/InputText";

const Inputs: React.FC = () => {
  const { t } = useTranslation("products");
  return (
    <>
      <InputText key="name" label={t("name")} name="name" />
    </>
  );
};

Inputs.displayName = "Inputs";
export default Inputs;
