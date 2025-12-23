import _ from "lodash";
import { useTranslation } from "react-i18next";
import InputText from "@/components/InputText";
import InputPhoneNumber from "@/components/InputPhoneNumber";

const Inputs = () => {
  const { t } = useTranslation("contact");
  return (
    <>
      <div className="flex flex-col gap-2">
        <InputText key="name" label={t("name")} name="name" />
        <InputPhoneNumber name="phone" label={t("phoneNumber")} />
      </div>
    </>
  );
};

Inputs.displayName = "Inputs";
export default Inputs;
