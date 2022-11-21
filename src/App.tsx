import React, { ReactElement, useEffect, useState } from "react";
import Header from "./components/Header/Header";
import Todo from "./components/Todo/Todo";
import "./App.less";
import CreateBtn from "./components/UI/CreateBtn/CreateBtn";
import Modal from "./components/UI/Modal/Modal";
import TodoCreate from "./components/TodoCreate/TodoCreate";
import TodoDetails from "./components/TodoDetails/TodoDetails";
import TodoDelete from "./components/TodoDelete/TodoDelete";
import TodoEdit from "./components/TodoEdit/TodoEdit";
import { db } from "./firebase-config";
import { collection, getDocs, orderBy, query } from "@firebase/firestore";
import { ITodo } from "./types/ITodo";

interface TodoContextInterface {
  todos: ITodo[];
  setTodos: React.Dispatch<React.SetStateAction<ITodo[]>>;
}

interface ModalContextInterface {
  isModal: boolean;
  setIsModal: React.Dispatch<React.SetStateAction<boolean>>;
}


export const TodoContext = React.createContext<TodoContextInterface>(
  {} as TodoContextInterface
);

export const ModalContext = React.createContext<ModalContextInterface>(
  {} as ModalContextInterface
);

function App() {
  const [isModal, setIsModal] = useState<boolean>(false);
  const [modalContent, setModalContent] = useState<ReactElement>(<></>);
  const [todos, setTodos] = useState<ITodo[]>([]);

  useEffect(() => {
    /**
     * Fetch todo list from firebase `todos` and order by `finishDate`
     */
    const fetchTodos = async () => {
      const todosCollection = collection(db, "todos");
      const data = await getDocs(query(todosCollection, orderBy("finishDate")));
      const todosData = [] as ITodo[];
      data.forEach((el) => {
        todosData.push({ id: el.id, ...el.data() } as ITodo);
      });
      setTodos(todosData);
    };
    fetchTodos();
  }, []);

  /**
   * Open modal window with `TodoCreate` component
   */
  const createHandler = () => {
    setModalContent(<TodoCreate />);
    setIsModal(true);
  };

  /**
   * Open modal window with `TodoDetails` component
   *
   * @param {ITodo} todo `ITodo` object
   */
  const detailsHandler = (todo: ITodo) => {
    setModalContent(
      <TodoDetails
        data={todo}
        onEdit={() => setModalContent(<TodoEdit id={todo.id!} />)}
      />
    );
    setIsModal(true);
  };

  /**
   * Open modal window with `TodoDelete` component.
   * Use stopPropagation()
   *
   * @param {React.MouseEvent<HTMLDivElement, MouseEvent>} e Mouse event
   * @param {ITodo} todo `ITodo` object
   */
  const deleteHandler = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    todo: ITodo
  ) => {
    e.stopPropagation();
    setModalContent(<TodoDelete data={todo} />);
    setIsModal(true);
  };

  return (
    <ModalContext.Provider value={{ isModal, setIsModal }}>
      <TodoContext.Provider value={{ todos, setTodos }}>
        <div>
          <Header />
          <div className="container">
            {todos.length !== 0 ? (
              todos.map((el) => (
                <Todo
                  key={el.id}
                  data={el}
                  onDelete={(e) => deleteHandler(e, el)}
                  onClick={() => detailsHandler(el)}
                />
              ))
            ) : (
              <h1>No Todos...</h1>
            )}
            <CreateBtn onClick={createHandler} />
            {isModal && (
              <Modal
                children={modalContent}
                onClose={() => setIsModal(false)}
              />
            )}
          </div>
        </div>
      </TodoContext.Provider>
    </ModalContext.Provider>
  );
}

export default App;
