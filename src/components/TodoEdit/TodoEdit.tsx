import { doc, updateDoc } from "firebase/firestore";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
  StorageError
} from "firebase/storage";
import React, { useContext, useState } from "react";
import { ModalContext, TodoContext } from "../../App";
import { db, storage } from "../../firebase-config";
import { IFile } from "../../types/IFile";
import { ITodo } from "../../types/ITodo";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import Button from "../UI/Button/Button";
import Loader from "../UI/Loader/Loader";
import Textarea from "../UI/Textarea/Textarea";
import TextInput from "../UI/TextInput/TextInput";
import { uuidv4 } from "@firebase/util";
import cl from "./TodoEdit.module.less";

interface TodoEditProps {
  /**
   * id of Todo
   */
  id: string;
}


/**
 * Component with a form to edit the todo
 *
 * @component TodoEdit
 *
 */
const TodoEdit: React.FC<TodoEditProps> = ({ id }) => {
  const todoDocumentRef = doc(db, "todos", id);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { todos, setTodos } = useContext(TodoContext);
  const { setIsModal } = useContext(ModalContext);
  const [data, setData] = useState<ITodo>(
    todos.find((todo) => todo.id === id) || ({} as ITodo)
  );

  /**
   * Function update all information about Todo in firebase
   * and upload new files in storage.
   *
   * @param {React.FormEvent<HTMLFormElement>} e Form event
   *
   */
  const onUpdateHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    setIsLoading(true);
    e.preventDefault();
    const form = e.currentTarget;

    if (form.todo_title.value.trim() === "") {
      setErrorMessage("Field 'Title' is required!");
      setIsLoading(false);
      return;
    }

    if (form.date.value === "") {
      setErrorMessage("Field 'Finish date' is required!");
      setIsLoading(false);
      return;
    }

    const files = form.files.files;
    const todoFiles = await uploadFiles(files);
    todoFiles.push(...data.files);

    const todo: ITodo = {
      id: id,
      title: form.todo_title.value.trim(),
      body: form.body.value.trim(),
      finishDate: form.date.value,
      files: todoFiles,
      checked: data.checked,
    };

    try {
      await updateDoc(todoDocumentRef, { ...todo });
      setTodos(todos.map((t) => (t.id === todo.id ? todo : t)));
      setIsModal(false);
    } catch (error) {
      setErrorMessage((error as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Function upload all files in firebase storage
   *
   * @param {FileList} files array of files from `<form>`
   *
   * @return {Promise<IFile[]>} data array of files prepared for firebase DB
   */
  const uploadFiles = async (files: FileList): Promise<IFile[]> => {
    if (files.length === 0) return [] as IFile[];
    const filesData: IFile[] = [];
    for (const file of files) {
      const filename = uuidv4();
      const storageRef = ref(storage, filename);
      const metadata = {
        contentType: file.type,
      };
      try {
        const uploadTask = await uploadBytes(storageRef, file, metadata);
        const fileUrl = await getDownloadURL(uploadTask.ref);
        filesData.push({
          name: file.name,
          url: fileUrl,
        });
      } catch (error) {
        setErrorMessage((error as Error).message);
      }
    }
    return filesData;
  };

  /**
   * Function check that all files less or equal 5Mb.
   * If one of the files is larger than 5Mb, clear the file input and display an error message
   *
   * @param {React.ChangeEvent<HTMLInputElement>} e Provides special properties and
   * methods for manipulating the options, layout, and presentation of elements.
   *
   */
  const filesChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.currentTarget.files;
    if (files?.length) {
      for (const file of files) {
        if (file.size > 1024 * 1024 * 5) {
          setErrorMessage(`Files can't be larger than 5mb`);
          e.currentTarget.value = "";
          break;
        }
      }
    }
  };

  /**
   * Function to delete todo file from firebase.
   * If file not found, remove from firestore only
   *
   * @param {IFile} file
   *
   */
  const onDeleteFileHandler = async (file: IFile) => {
    setIsLoading(true);
    const storageRef = ref(storage, file.url);
    try {
      const updateFiles = data.files.filter((f) => f.url !== file.url);
      const updateData = { ...data, files: updateFiles };
      setData(updateData);
      await deleteObject(storageRef);
      await updateDoc(todoDocumentRef, { files: updateFiles });
      setTodos(todos.map((todo) => (todo.id === id ? updateData : todo)));
    } catch (error) {
      const updateFiles = data.files.filter((f) => f.url !== file.url);
      setData({ ...data, files: updateFiles });
      if ((error as StorageError).code === "storage/object-not-found") {
        await updateDoc(todoDocumentRef, { files: updateFiles });
      } else {
        setErrorMessage((error as StorageError).message);
      }
    }
    setIsLoading(false);
  };

  return (
    <form onSubmit={(e) => onUpdateHandler(e)} className={cl.form}>
      <h3>Edit {data.title}</h3>
      <TextInput
        defaultValue={data.title}
        placeholder="Todo title"
        id="todo_title"
        name="todo_title"
      />
      <br />
      <Textarea
        defaultValue={data.body}
        id="body"
        name="body"
        placeholder="Description..."
      />
      <br />
      <label htmlFor="date">Finish until: </label>
      <input defaultValue={data.finishDate} type="date" id="date" name="date" />
      <br />
      {data.files.length !== 0 && (
        <>
          <b>Files:</b>
          <br />
        </>
      )}
      {data.files.map((file, index) => (
        <div className={cl.file} key={index}>
          <a target="_blank" href={file.url} rel="noreferrer">
            {file.name}
          </a>
          <span onClick={() => onDeleteFileHandler(file)} className={cl.delBtn}>
            &times;
          </span>
        </div>
      ))}
      <label htmlFor="files">
        <b>Add files:</b>{" "}
      </label>
      <br />
      <input
        onChange={(e) => filesChangeHandler(e)}
        type="file"
        name="files"
        id="files"
        multiple
      />
      <br />
      <ErrorMessage
        message={errorMessage}
        onClick={() => setErrorMessage("")}
      />
      <br />
      <div className={cl.btn}>
        <Button disabled={isLoading}>
          {isLoading ? <Loader /> : "Confirm"}
        </Button>
      </div>
    </form>
  );
};

export default TodoEdit;
