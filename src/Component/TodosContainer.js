import React, {useContext} from "react";
import Stack from 'react-bootstrap/Stack';
import TodoItem from './TodoItem';
import { NotesContext } from "../App";

function TodosContainer() {
  const notesContextData = useContext(NotesContext);

  return (
    <React.Fragment>
      <div className="todolistContainer">
        <Stack gap={3}>
          {
            notesContextData.notes.map((item, index) =>
              <TodoItem key={index} listItem={item} />
            )
          }
        </Stack>
      </div>
    </React.Fragment>
  );
}

export default TodosContainer;