import { deleteObject, ref } from "firebase/storage";
import React, { useContext, useState } from "react";
import { ModalContext, TodoContext } from "../../App";
import { db, storage } from "../../firebase-config";
import { doc, deleteDoc } from "firebase/firestore";
import { IFile } from "../../types/IFile";
import { ITodo } from "../../types/ITodo";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import Button from "../UI/Button/Button";
import TextInput from "../UI/TextInput/TextInput";
import cl from "./TodoDelete.module.less";
import Loader from "../UI/Loader/Loader";

interface TodoDeleteProps {
  /**
   * Todo object `ITodo`
   */
  data: ITodo;
}


/**
 * Component with a form to confirm the deletion of todo
 *
 * @component TodoDelete
 */
const TodoDelete: React.FC<TodoDeleteProps> = ({ data }) => {
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [inputValue, setInputValue] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { todos, setTodos } = useContext(TodoContext);
  const { setIsModal } = useContext(ModalContext);

  /**
   * Function to delete todo with files from firebase.
   *
   * @param {React.FormEvent<HTMLFormElement>} e Form event
   *
   */
  const onDeleteHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (inputValue.trim() === data.title) {
      setIsLoading(true);
      if (data.files.length !== 0) {
        data.files.forEach(async (file) => {
          await fileDelete(file);
        });
      }
      try {
        await deleteDoc(doc(db, "todos", data.id!));
        setTodos(todos.filter((el) => el.id !== data.id));
        setIsModal(false);
      } catch (error) {
        setErrorMessage((error as Error).message);
      }
      setIsLoading(false);
    } else {
      setErrorMessage("Titles don't match");
    }
    setIsLoading(false);
  };

  /**
   * Function to delete file from firebase storage
   *
   * @param {IFile} file file data
   *
   */
  const fileDelete = async (file: IFile) => {
    const storageRef = ref(storage, file.url);
    try {
      await deleteObject(storageRef);
    } catch (error) {
      setErrorMessage(
        errorMessage + (error as Error).message + file.name + "\n"
      );
    }
  };

  return (
    <form onSubmit={(e) => onDeleteHandler(e)}>
      <h3 className={cl.title}>Delete {data.title}?</h3>
      <hr />
      <br />
      <p>
        Type <b>{data.title}</b> to confirm
      </p>
      <br />
      <TextInput
        onChange={(e) => setInputValue(e.currentTarget.value)}
        value={inputValue}
      />
      <br />
      <ErrorMessage
        message={errorMessage}
        onClick={() => setErrorMessage("")}
      />
      <br />
      <div className={cl.btn}>
        <Button disabled={isLoading}>
          {isLoading ? <Loader /> : "Delete"}
        </Button>
      </div>
    </form>
  );
};

export default TodoDelete;
