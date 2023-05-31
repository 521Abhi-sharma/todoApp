import React,{useState} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import ThemeProvider from 'react-bootstrap/ThemeProvider'
import TodosContainer from './Component/TodosContainer';
import Head from './Component/Header';
import Footer from './Component/Footer';
import TodoFrom from './Component/TodoForm';
import "./App.css";

function App() {
  const getNoteBookDataFromLocalStorage = localStorage.getItem('data')===null?[]:JSON.parse(localStorage.getItem('data'));
  console.log("null inisial data",getNoteBookDataFromLocalStorage);
  const [noteBookData,SetNoteBookData] = useState(getNoteBookDataFromLocalStorage);
  const [editNoteData, seteditNoteData] = useState({});


  const getAllList =()=>{
    const allList = localStorage.getItem('data')===null?[]:JSON.parse(localStorage.getItem('data'));
    SetNoteBookData(allList);
  }

  const noteBookDataAdd=(fromData)=>{
    
    SetNoteBookData((prevNoteBook)=>{
      let string = JSON.stringify([fromData, ...prevNoteBook])
      localStorage.setItem('data',string);
      return [fromData, ...prevNoteBook];
    });
  }

  const noteBookDataDelete=(noteBookId)=>{
    const allList = localStorage.getItem('data')===null?[]:JSON.parse(localStorage.getItem('data'));
    const result = allList.filter((item)=>{
      return item.id !== noteBookId;
    });
    let string = JSON.stringify(result)
    localStorage.setItem('data',string);
    SetNoteBookData(result);
  }

  const completeNote =(noteBookId)=>{
    const result = noteBookData.map((item)=>{
      if(item.id === noteBookId){
        return {...item, status:true};
      }
      return item;
    });
    let string = JSON.stringify(result)
    localStorage.setItem('data',string);
    SetNoteBookData(result);
  }

  const undoNote =(noteBookId)=>{
    const result = noteBookData.map((item)=>{
      if(item.id === noteBookId){
        return {...item, status:false};
      }
      return item;
    });
    let string = JSON.stringify(result)
    localStorage.setItem('data',string);
    SetNoteBookData(result);
  }


  

  // const editNote =(noteBookId,formData)=>{
  //   const result = noteBookData.map((item)=>{
  //     if(item.id === noteBookId){
  //       return {...item, formData};
  //     }
  //     return item;
  //   });
  //   SetNoteBookData(result);
  // }

  const getNoteDataById =(noteBookId)=>{
    const result = noteBookData.find((item)=>{
      return item.id===noteBookId;
    });

    seteditNoteData((prev)=>{
      return {...prev,  id:result.id, status:result.status, title:result.title, date:result.date };
    });
  }

  const noteBookDataEdit = (fromData) =>{
    console.log('code is here',fromData);
    console.log('edit hone wala data',editNoteData);
    const result = noteBookData.map((item)=>{
      if(item.id === editNoteData.id){
        return {...item, title:fromData.title, date:fromData.date};
      }
      return item;
    });
    console.log(result);
    let string = JSON.stringify(result)
    localStorage.setItem('data',string);
    SetNoteBookData(result);
  }



  //here bugs 
  const filterNOteBookByDate=(Date)=>{
    const result = noteBookData.filter((item)=>{
      return item.date === Date;
    });
    SetNoteBookData(result);
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
