import React, { useContext, useState } from "react";
import { ITodo } from "../../types/ITodo";
import Button from "../UI/Button/Button";
import Textarea from "../UI/Textarea/Textarea";
import TextInput from "../UI/TextInput/TextInput";
import cl from "./TodoCreate.module.less";
import { addDoc, collection } from "@firebase/firestore";
import { ref, uploadBytes } from "@firebase/storage";
import { db, storage } from "../../firebase-config";
import { uuidv4 } from "@firebase/util";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import { IFile } from "../../types/IFile";
import { getDownloadURL } from "firebase/storage";
import Loader from "../UI/Loader/Loader";
import dayjs from "dayjs";
import { ModalContext, TodoContext } from "../../App";

/**
 * Component with a form where create a new Todo
 *
 * @component TodoCreate
 *
 */
const TodoCreate: React.FC = () => {
  const todosCollection = collection(db, "todos");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { todos, setTodos } = useContext(TodoContext);
  const { setIsModal } = useContext(ModalContext);

  /**
   * Function to create new todo from form data.
   * Upload files and create new doc in firebase
   *
   * @param {React.FormEvent<HTMLFormElement>} e Form event
   *
   */
  const onCreateHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
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

    const todo: ITodo = {
      title: form.todo_title.value.trim(),
      body: form.body.value.trim(),
      finishDate: form.date.value,
      files: todoFiles,
      checked: false,
    };

    try {
      const doc = await addDoc(todosCollection, todo);
      todo.id = doc.id;
      setTodos([...todos, todo]);
      setIsModal(false);
    } catch (error) {
      setErrorMessage((error as Error).message);
    }

    setIsLoading(false);
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

  return (
    <form onSubmit={(e) => onCreateHandler(e)} className={cl.form}>
      <h3>Create New Todo</h3>
      <TextInput placeholder="Todo title" id="todo_title" name="todo_title" />
      <br />
      <Textarea id="body" name="body" placeholder="Description..." />
      <br />
      <label htmlFor="date">Finish until: </label>
      <input
        defaultValue={dayjs().format("YYYY-MM-DD9")}
        type="date"
        id="date"
        name="date"
      />
      <br />
      <label htmlFor="files">Files: </label>
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
      <div className={cl.btn}>
        <Button disabled={isLoading}>
          {isLoading ? <Loader /> : "Submit"}
        </Button>
      </div>
    </form>
  );
};

export default TodoCreate;
