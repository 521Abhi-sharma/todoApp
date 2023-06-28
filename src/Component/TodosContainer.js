import React, {useContext} from "react";
import Stack from 'react-bootstrap/Stack';
import TodoItem from './TodoItem';
import { NotesContext } from "../App";

function TodosContainer() {
  const notesContextData = useContext(NotesContext);
  const data = [...notesContextData.notes].reverse();
  // console.log('order right as it is',notesContextData.notes);
  // console.log('reverse',data);
  return (
    <React.Fragment>
      <div className="todolistContainer">
        <Stack gap={3}>
          {
            
            data.map((item, index) =>
              <TodoItem key={index} listItem={item} />
            )
          }
        </Stack>
      </div>
    </React.Fragment>
  );
}

export default TodosContainer;