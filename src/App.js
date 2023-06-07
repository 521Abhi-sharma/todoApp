import React,{useState, useReducer} from 'react';
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
      const editResult = state.map((item)=>{
        if(item.id === action.editNoteDataId){
          return {...item, title:action.data.title, date:action.data.date};
        }
        return item;
      });
      storeDataInLocalStorage(JSON.stringify(editResult));
      return editResult;  
    case "getAll" :
      return state;
    case "filter" :
      return state.filter((item)=>{
          return item.date === action.date;
        });

    default:
      return state;
  }
};

function App() {
  const getNoteBookDataFromLocalStorage = localStorage.getItem('data')===null?[]:JSON.parse(localStorage.getItem('data'));
  const [noteBookData, dispatch] = useReducer(reducer, getNoteBookDataFromLocalStorage);
  const [editNoteData, seteditNoteData] = useState({});

  const getAllList =()=>{
    dispatch({ type: "getAll" });
  }

  const noteBookDataAdd=(fromData)=>{
    dispatch({ type: "Add", data:fromData });
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
    const result = noteBookData.find((item)=>{
      return item.id===noteBookId;
    });

    seteditNoteData((prev)=>{
      return {...prev,  id:result.id, status:result.status, title:result.title, date:result.date };
    });
  }

  const noteBookDataEdit = (fromData) =>{
    dispatch({ type: "Edit", data:fromData, editNoteDataId : editNoteData.id  });
  }

  //here bugs 
  const filterNOteBookByDate=(Date)=>{
    dispatch({ type: "filter", date:Date });
  }


  return (

    <React.Fragment>
      <ThemeProvider
        breakpoints={['xxxl', 'xxl', 'xl', 'lg', 'md', 'sm', 'xs', 'xxs']}
        minBreakpoint="xxs"
      >
        <Head />
        <TodoFrom collectFormData={noteBookDataAdd} collectEditFormData={noteBookDataEdit} filterNOteBookData={filterNOteBookByDate} editNoteData={editNoteData} getAllList={getAllList}/>
        <TodosContainer list={noteBookData} onDeleteNote={noteBookDataDelete} onCompleteNote={completeNote} onUndoNote={undoNote} getNote={getNoteDataById} />
        <Footer/>
      </ThemeProvider>
    </React.Fragment>
  );
}

export default App;
