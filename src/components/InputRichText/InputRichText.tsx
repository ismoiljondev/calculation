import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import React, { useRef, useState, useCallback } from "react";
import { Editor } from "react-draft-wysiwyg";
import { EditorState, convertToRaw, ContentState } from "draft-js";
import { Controller, useFormContext } from "react-hook-form";
import draftToHtml from "draftjs-to-html";
import htmlToDraft from "html-to-draftjs";
import { cn } from "@/utils/classNames";
import _ from "lodash";
import FuseLoading from "@fuse/core/FuseLoading";

interface InputRichTextProps {
  name: string;
  label: string;
  className?: string;
  action: "CREATE" | "EDIT";
}

const InputRichText: React.FC<InputRichTextProps> = ({
  name,
  label,
  className,
  action,
}) => {
  const {
    control,
    formState: { errors },
    getValues,
  } = useFormContext();

  const editorRef = useRef<any>(null);

  const focusEditor = () => {
    if (editorRef.current?.editor?.editor) {
      editorRef.current.editor.editor.focus();
    }
  };

  if (action === "EDIT" && !getValues(name)) return <FuseLoading />;

  return (
    <div className={cn("mb-6", className)}>
      <label
        onClick={focusEditor}
        className="block mb-2 font-medium cursor-pointer"
      >
        {label}
      </label>

      <Controller
        name={name}
        control={control}
        render={({ field }) => {
          const createInitialEditorState = useCallback(() => {
            if (field.value) {
              const blocksFromHtml = htmlToDraft(field.value);
              const contentState = ContentState.createFromBlockArray(
                blocksFromHtml.contentBlocks,
                blocksFromHtml.entityMap
              );
              return EditorState.createWithContent(contentState);
            }
            return EditorState.createEmpty();
          }, [field.value]);

          const [editorState, setEditorState] = useState(
            createInitialEditorState
          );

          const handleEditorChange = (state: EditorState) => {
            setEditorState(state);
            const raw = convertToRaw(state.getCurrentContent());
            const html = draftToHtml(raw);
            field.onChange(html);
          };

          return (
            <>
              <div
                className={cn(
                  "border border-gray-300 rounded-md p-2 min-h-[150px] bg-white",
                  !!errors &&
                    (_.get(errors, name.split("."))
                      ?.message as string as string) &&
                    "border-red-500"
                )}
                onClick={focusEditor}
              >
                <Editor
                  ref={editorRef}
                  editorState={editorState}
                  onEditorStateChange={handleEditorChange}
                  wrapperClassName="demo-wrapper"
                  editorClassName="demo-editor"
                />
              </div>
              <p className="text-red-500 text-sm mt-1">
                {!!errors &&
                  (_.get(errors, name.split("."))?.message as string as string)}
              </p>
            </>
          );
        }}
      />
    </div>
  );
};

InputRichText.displayName = "InputRichText";
export default InputRichText;
