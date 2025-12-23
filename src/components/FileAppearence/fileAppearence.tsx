import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
import React from "react";
import { useTranslation } from "react-i18next";
import { closeDialog, openDialog } from "@fuse/core/FuseDialog/fuseDialogSlice";
import { useDispatch } from "react-redux";
import {
  Button,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import {
  useAutoloanControllerRemoveFile,
  useMicroloanControllerRemoveFile,
  useMortgageControllerRemoveFile,
} from "@/api/api";

interface FileAppearenceProps {
  files: any;
  type: "autoloan" | "microloan" | "mortgage";
  loanId: string;
  disabled: boolean;
}

const FileAppearence: React.FC<FileAppearenceProps> = ({
  files,
  type,
  loanId,
  disabled,
}) => {
  const { t } = useTranslation("autoloan");
  const serverUrl = import.meta.env.VITE_API_BASE_URL;
  const dispatch = useDispatch();
  const { mutateAsync: removeAutoloanFile } = useAutoloanControllerRemoveFile();
  const { mutateAsync: removeMortgageFile } = useMortgageControllerRemoveFile();
  const { mutateAsync: removeMicroloanFile } =
    useMicroloanControllerRemoveFile();

  async function handleDelete(file: string) {
    try {
      switch (type) {
        case "autoloan":
          await removeAutoloanFile({ data: { file, id: loanId } });
          break;
        case "microloan":
          await removeMicroloanFile({ data: { file, id: loanId } });
          break;
        case "mortgage":
          await removeMortgageFile({ data: { file, id: loanId } });
          break;
      }
    } catch (err) {
      console.log(err);
    } finally {
      dispatch(closeDialog());
      window.location.reload();
    }
  }

  return (
    <div className="col-span-3">
      {files?.map((item: string) => (
        <div className="flex gap-2 items-start" key={item}>
          <a
            href={`${serverUrl}/file/download/${item}`}
            download
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline block mb-2 bg-inherit border-0"
          >
            {t("download")} {item}
          </a>
          {disabled && (
            <FuseSvgIcon
              onClick={() =>
                dispatch(
                  openDialog({
                    children: (
                      <React.Fragment>
                        <DialogTitle id="alert-dialog-title">
                          {t("delete_modal_title", { ns: "general" })}
                        </DialogTitle>
                        <DialogContent>
                          <DialogContentText id="alert-dialog-description">
                            {t("delete_description", { ns: "general" })}
                          </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                          <Button
                            onClick={() => handleDelete(item)}
                            color="primary"
                          >
                            {t("delete_request_yes", { ns: "general" })}
                          </Button>
                          <Button
                            color="error"
                            onClick={() => dispatch(closeDialog())}
                            autoFocus
                          >
                            {t("delete_request_no", { ns: "general" })}
                          </Button>
                        </DialogActions>
                      </React.Fragment>
                    ),
                  })
                )
              }
              className="cursor-pointer"
            >
              heroicons-outline:trash
            </FuseSvgIcon>
          )}
        </div>
      ))}
    </div>
  );
};

FileAppearence.displayName = "FileAppearence";
export default FileAppearence;
