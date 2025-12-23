import { useEffect } from "react";
import { Control, useFormState } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useBlocker } from "react-router";

const useBlockerInForm = (control: Control) => {
  // const { t } = useTranslation("general");
  // const { isDirty, isSubmitting } = useFormState({
  //   control: control,
  // });
  // useEffect(() => {
  //   const handleBeforeUnload = (e: BeforeUnloadEvent) => {
  //     if (isDirty && !isSubmitting) {
  //       e.preventDefault();
  //       e.returnValue = "";
  //     }
  //   };
  //   window.addEventListener("beforeunload", handleBeforeUnload);
  //   return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  // }, [isDirty, isSubmitting]);
  // const blocker = useBlocker(isDirty && !isSubmitting);
  // useEffect(() => {
  //   if (blocker.state === "blocked") {
  //     const confirmLeave = window.confirm(t("unsaved_changes_warning"));
  //     if (confirmLeave) blocker.proceed();
  //     else blocker.reset();
  //   }
  // }, [blocker, t]);
};

export default useBlockerInForm;
