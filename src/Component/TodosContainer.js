import React from "react";
import Stack from 'react-bootstrap/Stack';
import TodoItem from './TodoItem';

function TodosContainer(props) {
  const deleteNote=(id)=>{
    props.onDeleteNote(id);
  }

  const doneNote=(id)=>{
    props.onCompleteNote(id);
  }

  const UndoNote=(id)=>{
    props.onUndoNote(id);
  }


  

  const getNoteDataBySelectedId=(id)=>{
    props.getNote(id);
  }

  

  console.log(props.list);
  return (
    <React.Fragment>
      <div className="todolistContainer">
        <Stack gap={3}>
          {
            props.list.map((item, index) =>
              <TodoItem key={index} listItem={item} Delete={deleteNote} Done={doneNote} Undo={UndoNote} getNoteData={getNoteDataBySelectedId}/>
            )
          }
        </Stack>
      </div>
    </React.Fragment>
  );
}

export default TodosContainer;