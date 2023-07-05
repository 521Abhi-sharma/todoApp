import React, {useContext} from "react";
import Stack from 'react-bootstrap/Stack';
import TodoItem from './TodoItem';
import { NotesContext } from "../App";

function TodosContainer() {
  const notesContextData = useContext(NotesContext);
  const data = [...notesContextData.notes].reverse();
  
  return (
    <React.Fragment>
      <div className="todolistContainer">
        <Stack gap={3}>
          {
            data.length>0 &&(
            data.map((item, index) =>
              <TodoItem key={index} listItem={item} />
            ))}
          {
            data.length===0 && (<p className="item_not_found">item not found</p>)
          }
        </Stack>
      </div>
    </React.Fragment>
  );
}

export default TodosContainer;