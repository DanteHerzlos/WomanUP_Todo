import React from "react";
import cl from "./TodoDetails.module.less";
import dayjs from "dayjs";
import Button from "../UI/Button/Button";
import { ITodo } from "../../types/ITodo";

interface TodoDetailsProps {
  /**
   * Button action to change component to `<TodoEdit>`
   */
  onEdit?: React.MouseEventHandler<HTMLSpanElement>;
  /**
   * Todo object `ITodo`
   */
  data: ITodo;
}

/**
 * Component with a detail information of todo
 *
 * @component TodoDetails
 */
const TodoDetails: React.FC<TodoDetailsProps> = ({
  onEdit,
  data,
}) => {
  return (
    <>
      <h3 className={cl.title}>{data.title}</h3>
      <hr />
      <p className={cl.body}>{data.body}</p>
      <p className={cl.date}>
        <b>Finish until: </b>
        {dayjs(data.finishDate).format("DD.MM.YY")}
      </p>
      {data.files.length !== 0 &&
        <>
          <h3>Files:</h3>
          <ol className={cl.files}>
            {data.files.map((file, index) => (
              <li key={index}>
                <a target="_blank" href={file.url} rel="noreferrer">
                  {file.name}
                </a>
              </li>
            ))}
          </ol>
        </> 
      }

      <div className={cl.btn}>
        <Button onClick={onEdit}>Edit</Button>
      </div>
    </>
  );
};

export default TodoDetails;
