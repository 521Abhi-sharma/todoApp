import React, { useState, useReducer, createContext, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import TodosContainer from './Component/TodosContainer';
import Head from './Component/Header';
import Footer from './Component/Footer';
import TodoFrom from './Component/TodoForm';
import "./App.css";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// const baseURL = "http://localhost:3030/notes";
const baseURL ="https://todo-app-server-3c0p.onrender.com/notes";


const getDataFromApi = async () => {
  const res = await axios.get(baseURL);
  return res;
}

const AddDataUsingApi = async (data) => {
  const result = await axios.post(baseURL, {
    title: data.title,
    status: data.status,
    date: data.date
  });
  return result;
}

const deleteDataUsingApi = async (id) => {
  const url = `${baseURL}/${id}`;
  const result = await axios.delete(url);
  return result;
}

const updateDataUsingApi = async (id, data) => {
  const url = `${baseURL}/${id}`;
  const result = await axios.put(url, {
    title: data.title,
    status: data.status,
    date: data.date
  });
  return result;
}

const filterDataUsingApi = async (date) => {
  const url = `${baseURL}?date=${date}`;
  const result = await axios.get(url);
  return result;
}


const reducer = (state, action) => {
  switch (action.type) {
    case "init":
      return action.Data;
    case "Add":
      
      return [...state, action.Data];
    case "Done":
      
      const doneResult = state.map((item) => {
        if (item.id === action.id) {
          return { ...item, status: true };
        }
        return item;
      });
      return doneResult;
    case "UnDone":
      
      const UnDoneResult = state.map((item) => {
        if (item.id === action.id) {
          return { ...item, status: false };
        }
        return item;
      });
      return UnDoneResult;
    case "Delete":
      
      const deleteResult = state.filter((item) => {
        return item.id !== action.id;
      });
      return deleteResult;
    case "Edit":
      
      const editResult = state.map((item) => {
        if (item.id === action.editNoteDataId) {
          return { ...item, title: action.data.title, date: action.data.date };
        }
        return item;
      });
      return editResult;
    case "filter":
      return action.data;
    default:
      return state;
  }
};

export const NotesContext = createContext();

function App() {
  const [noteBookData, dispatch] = useReducer(reducer, []);
  const [editNoteData, seteditNoteData] = useState({});
  const [timeTracker, setTimeTracker] = useState('00:00:00');
  
  console.log('state data', noteBookData);

  const getAllList = async () => {
    const response = await getDataFromApi();
    dispatch({ type: "init", Data: response.data });
  }

  useEffect(() => {
    removeDataFromServerInEvery5mint();
    getAllList();
  }, []);

  // delete functionality automatically START
  
  const removeDataFromServerInEvery5mint = async () => {
    console.log('delete functionality running');
  };

  
  //end

  // abhi code  time
  //step1: make deadline
  const getDealLineTime=()=>{
    // in this funciton i have added mint for making deadline
    let deadline = new Date();
    console.log('time',deadline);
    // deadline.setSeconds(deadline.getSeconds() + 10);
    deadline.setMinutes(deadline.getMinutes() + 1);
    console.log('time after add time',deadline);
    return deadline;
  }

  //step 2 : make a function that return remaining time
  const getTimeRemaining = (e) => {
    const total = Date.parse(e) - Date.parse(new Date());
    const seconds = Math.floor((total / 1000) % 60);
    const minutes = Math.floor((total / 1000 / 60) % 60);
    const hours = Math.floor((total / 1000 / 60 / 60) % 24);
    return {
        total, hours, minutes, seconds
    };
  }

  // step 3:make a function that update tracker time
  const startTimer = (e) => {
    let { total, hours, minutes, seconds }
                = getTimeRemaining(e);
    // console.log('total',total);
    if (total >= 0) {

        // update the timer
        // check if less than 10 then we need to
        // add '0' at the beginning of the variable
        setTimeTracker(
            (hours > 9 ? hours : '0' + hours) + ':' +
            (minutes > 9 ? minutes : '0' + minutes) + ':'
            + (seconds > 9 ? seconds : '0' + seconds)
        )
    }
    if(total=== 0){
      trackerAction();
      // console.log('here run again');
    }
  }

  // step 5 make a fnction that trigger timmerFunctionality
  const trackerAction =()=>{
    const deadline = getDealLineTime();
    const timer =setInterval(() => {
      startTimer(deadline);
    }, 1000);
    // clearTimeout(timer);
  }


  useEffect(() => {
    trackerAction();
  },[]);
  
  // abhi code end

  // ================END==========

  const noteBookDataAdd = async (fromData) => {
    const response = await AddDataUsingApi(fromData);
    toast.success('Item added');
    dispatch({ type: "Add", Data: response.data });
  }

  const noteBookDataDelete = (noteBookId) => {
    deleteDataUsingApi(noteBookId);  // call api for delete data from server
    toast.success('Item deleted');
    dispatch({ type: "Delete", id: noteBookId });   // here update state
  }

  const completeNote = (note) => {
    const noteBookId = note.id;
    note.status = true;
    updateDataUsingApi(noteBookId, note);
    toast.success('Item updated');
    dispatch({ type: "Done", id: noteBookId });
  }

  const undoNote = (note) => {
    const noteBookId = note.id;
    note.status = false;
    updateDataUsingApi(noteBookId, note);
    toast.success('Item updated');
    dispatch({ type: "UnDone", id: noteBookId });
  }

  const noteBookDataEdit = (note) => {
    seteditNoteData((prev) => {
      return { ...prev, id: note.id, status: note.status, title: note.title, date: note.date };
    });
  }

  const submitEditData = (formData) => {
    const editNoteId = editNoteData.id;
    updateDataUsingApi(editNoteId, formData);
    toast.success('Item updated');
    dispatch({ type: "Edit", data: formData, editNoteDataId: editNoteId });
  }


  const filterNOteBookByDate = async (Date) => {
    if(!Date){
      getAllList();
      return;
    }
    const response = await filterDataUsingApi(Date);
    dispatch({ type: "filter", data:response.data });
  }

  return (
    <NotesContext.Provider value={
      {
        notes: noteBookData,
        onAdd: noteBookDataAdd,
        onDone: completeNote,
        onEdit: noteBookDataEdit,
        onSubmitEditData: submitEditData,
        EditableFormData: editNoteData,
        onUndo: undoNote,
        onDelete: noteBookDataDelete,
        onRefresh: getAllList,
        onFilter: filterNOteBookByDate
      }
    }>
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <Head timeTracker={timeTracker}/>
      <TodoFrom />
      <TodosContainer />
      <Footer />

    </NotesContext.Provider>
  );
}

export default App;
