import React,{useState, useReducer , createContext} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import ThemeProvider from 'react-bootstrap/ThemeProvider'
import TodosContainer from './Component/TodosContainer';
import Head from './Component/Header';
import Footer from './Component/Footer';
import TodoFrom from './Component/TodoForm';
import "./App.css";

const storeDataInLocalStorage=(string)=>{
  localStorage.setItem('data',string);
}
const reducer = (state, action) => {
  switch (action.type) {
    case "Add":
      // storeDataInLocalStorage(JSON.stringify([action.data, ...action.storageData]));
      // return [action.data, ...action.storageData];
      storeDataInLocalStorage(JSON.stringify([action.data, ...state]));
      return [action.data, ...state];
    case "Done" :
      const doneResult = state.map((item)=>{
        if(item.id === action.id){
          return {...item, status:true};
        }
        return item;
      });
      storeDataInLocalStorage(JSON.stringify(doneResult));
      return doneResult;
    case "UnDone":
      const UnDoneResult = state.map((item)=>{
        if(item.id === action.id){
          return {...item, status:false};
        }
        return item;
      });
      storeDataInLocalStorage(JSON.stringify(UnDoneResult));
      return UnDoneResult;
    case "Delete":
      const deleteResult = state.filter((item)=>{
        return item.id !== action.id;
      });
      storeDataInLocalStorage(JSON.stringify(deleteResult));
      return deleteResult;
    case "Edit" :
      const editResult = action.storageData.map((item)=>{
        if(item.id === action.editNoteDataId){
          return {...item, title:action.data.title, date:action.data.date};
        }
        return item;
      });
      storeDataInLocalStorage(JSON.stringify(editResult));
      return editResult;  
    case "getAll" :
      return action.storageData;
    case "filter" :
      const filterResult = action.storageData.filter((item)=>{
        return item.date === action.date;
      });
      return filterResult;
    default:
      return state;
  }
};

export const NotesContext = createContext();

function App() {
  const getNoteBookDataFromLocalStorage = localStorage.getItem('data')===null?[]:JSON.parse(localStorage.getItem('data'));
  const [noteBookData, dispatch] = useReducer(reducer, getNoteBookDataFromLocalStorage);
  const [editNoteData, seteditNoteData] = useState({});

  console.log("state data",noteBookData);
  console.log("storage data",getNoteBookDataFromLocalStorage);


  const getAllList =()=>{
    dispatch({ type: "getAll" ,storageData:getNoteBookDataFromLocalStorage});
  }

  const noteBookDataAdd=(fromData)=>{
    dispatch({ type: "getAll" ,storageData:getNoteBookDataFromLocalStorage});
    dispatch({ type: "Add",storageData:getNoteBookDataFromLocalStorage, data:fromData });
  }

  const noteBookDataDelete=(noteBookId)=>{
    dispatch({ type: "Delete", id:noteBookId });
  }

  const completeNote =(noteBookId)=>{
    dispatch({ type: "Done", id:noteBookId });
  }

  const undoNote =(noteBookId)=>{
    dispatch({ type: "UnDone", id:noteBookId });
  }


  const getNoteDataById =(noteBookId)=>{
    const result = getNoteBookDataFromLocalStorage.find((item)=>{
      return item.id===noteBookId;
    });

    seteditNoteData((prev)=>{
      return {...prev,  id:result.id, status:result.status, title:result.title, date:result.date };
    });
  }

  const noteBookDataEdit = (fromData) =>{
    dispatch({ type: "Edit",storageData:getNoteBookDataFromLocalStorage, data:fromData, editNoteDataId : editNoteData.id  });
  }

  const filterNOteBookByDate=(Date)=>{
    dispatch({ type: "filter",storageData:getNoteBookDataFromLocalStorage, date:Date});
  }

  return (
    <NotesContext.Provider value={
      {
        notes:noteBookData,
        onAdd:noteBookDataAdd,
        onEditGetNoteData:getNoteDataById,
        onDone:completeNote,
        onEdit:noteBookDataEdit,
        EditableFormData:editNoteData,
        onUndo:undoNote,
        onDelete:noteBookDataDelete,
        onRefresh:getAllList,
        onFilter:filterNOteBookByDate
      }
      }>
      <ThemeProvider
        breakpoints={['xxxl', 'xxl', 'xl', 'lg', 'md', 'sm', 'xs', 'xxs']}
        minBreakpoint="xxs"
      >
        <Head />
        <TodoFrom collectFormData={noteBookDataAdd} collectEditFormData={noteBookDataEdit} filterNOteBookData={filterNOteBookByDate} editNoteData={editNoteData} getAllList={getAllList}/>
        <TodosContainer />
        <Footer/>
      </ThemeProvider>
    </NotesContext.Provider>
  );
}

export default App;
