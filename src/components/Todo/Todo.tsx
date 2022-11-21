import React, { useContext, useState } from "react";
import cl from "./Todo.module.less";
import dayjs from "dayjs";
import { ITodo } from "../../types/ITodo";
import { db } from "../../firebase-config";
import { doc, updateDoc } from "firebase/firestore";
import { TodoContext } from "../../App";

interface TodoProps {
  /**
   * Action when click on Todo component
   */
  onClick?: React.MouseEventHandler<HTMLDivElement>;
  /**
   * Action when click on delete button of Todo component
   */
  onDelete?: React.MouseEventHandler<HTMLDivElement>;
  /**
   * An object containing the todo data
   */
  data: ITodo;
}
/**
 * Todo component.
 *
 * @component Todo
 * 
 */

const Todo: React.FC<TodoProps> = ({ onClick, onDelete, data }): React.ReactElement => {
  const [checked, setChecked] = useState<boolean>(data.checked);
  const [isExpired] = useState<boolean>(
    dayjs().diff(dayjs(data.finishDate)) / (1000 * 60 * 60 * 24) > 1
  );
  const { todos, setTodos } = useContext(TodoContext);

  /**
   * Update `checked` field in the firebase document `todos`.
   * Update todo list state with changed `checked` state
   *
   * @returns `void`
   */
  const onCheckHandler = async () => {
    try {
      await updateDoc(doc(db, "todos", data.id!), { checked: !checked });
      setTodos(
        todos.map((todo) =>
          todo.id === data.id ? { ...data, checked: checked } : todo
        )
      );
      setChecked(!checked);
    } catch (error) {
      console.log((error as Error).message);
    }
  };

  return (
    <div
      onClick={onClick}
      className={
        checked || isExpired ? [cl.todo, cl.disable].join(" ") : cl.todo
      }
    >
      <input
        onChange={onCheckHandler}
        checked={checked}
        onClick={(e) => e.stopPropagation()}
        className={cl.checkbox}
        type={"checkbox"}
      />
      <h2>{data.title}</h2>
      <span className={isExpired ? [cl.date, cl.disable].join(" ") : cl.date}>
        Finish until: {dayjs(data.finishDate).format("DD.MM.YY")}
      </span>
      <span onClick={onDelete} className={cl.delBtn}>
        &times;
      </span>
    </div>
  );
};

export default Todo;
