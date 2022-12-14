import React, { useEffect, useState } from "react";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import { useSelector } from "react-redux";
import ShowMoreButton from "../../components/ShowMoreButton/ShowMoreButton";
import TaskItem from "../../components/TaskItem/TaskItem";
import c from "./Important.module.css";

const Important = () => {
  const todos = useSelector((state) => state.todos.todos);
  const filters = useSelector((state) => state.filters.filters);

  const filteredTodos = todos.filter((todo) => {
    if (filters.length === 0) {
      return (
        todo.isImportant === true &&
        todo.isDeleted === false &&
        todo.isDone === false
      );
    } else {
      return (
        todo.isImportant === true &&
        todo.isDeleted === false &&
        todo.isDone === false &&
        filters.every((tag) => todo.tags.includes(tag))
      );
    }
  });

  const [more, setMore] = useState({
    hasMore: filteredTodos.length > 5,
    isOpened: false,
  });

  const [draggableTodos, setDraggableTodos] = useState([]);

  useEffect(() => {
    setMore({ ...more, hasMore: filteredTodos.length > 5 });
    setDraggableTodos(filteredTodos);
  }, [todos, filters]);

  function handleOnDragEnd(result) {
    if (!result.destination) return;

    const items = Array.from(draggableTodos);
    const [reorderItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderItem);

    setDraggableTodos(items);
  }

  return (
    <div className={c.myTasks}>
      {filteredTodos.length === 0 ? (
        <div style={{ padding: "10px 20px" }}>Нет задач</div>
      ) : (
        <DragDropContext
          onDragEnd={handleOnDragEnd}
          onBeforeDragStart={() => setMore({ ...more, isOpened: true })}
        >
          <Droppable droppableId="important">
            {(provided) => (
              <ul {...provided.droppableProps} ref={provided.innerRef}>
                {draggableTodos.map((t, i) => {
                  if (i > 4) return null;
                  return <TaskItem key={t.id} {...t} index={i} />;
                })}

                {more.isOpened &&
                  draggableTodos.map((t, i) => {
                    if (i < 5) return null;
                    return <TaskItem key={t.id} {...t} index={i} />;
                  })}
                {provided.placeholder}
              </ul>
            )}
          </Droppable>
        </DragDropContext>
      )}
      {!more.isOpened && more.hasMore && (
        <ShowMoreButton more={more} setMore={setMore} todos={filteredTodos} />
      )}
    </div>
  );
};

export default Important;
