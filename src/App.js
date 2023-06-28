import React, { useState, useReducer, createContext, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import TodosContainer from './Component/TodosContainer';
import Head from './Component/Header';
import Footer from './Component/Footer';
import TodoFrom from './Component/TodoForm';
import "./App.css";
import axios from "axios";

const baseURL = "http://localhost:3030/notes";


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
      const filterResult = state.filter((item) => {
        return item.date === action.date;
      });
      return filterResult;
    default:
      return state;
  }
};

export const NotesContext = createContext();

function App() {
  const [noteBookData, dispatch] = useReducer(reducer, []);
  const [editNoteData, seteditNoteData] = useState({});
  console.log('state data', noteBookData);

  const getAllList = async () => {
    const response = await getDataFromApi();
    dispatch({ type: "init", Data: response.data });
  }

  useEffect(() => {
    getAllList();
  }, []);


  const noteBookDataAdd = async (fromData) => {
    const response = await AddDataUsingApi(fromData);
    getAllList();
    dispatch({ type: "Add", Data: response.data });
  }

  const noteBookDataDelete = (noteBookId) => {
    deleteDataUsingApi(noteBookId);  // call api for delete data from server
    dispatch({ type: "Delete", id: noteBookId });   // here update state
  }

  const completeNote = (note) => {
    const noteBookId = note.id;
    note.status = true;
    updateDataUsingApi(noteBookId, note);
    dispatch({ type: "Done", id: noteBookId });
  }

  const undoNote = (note) => {
    const noteBookId = note.id;
    note.status = false;
    updateDataUsingApi(noteBookId, note);
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
    dispatch({ type: "Edit", data: formData, editNoteDataId: editNoteId });
  }


  const filterNOteBookByDate = (Date) => {
    dispatch({ type: "filter", date: Date });
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

      <Head />
      <TodoFrom />
      <TodosContainer />
      <Footer />

    </NotesContext.Provider>
  );
}

export default App;
