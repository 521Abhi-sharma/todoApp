import React,{useState,useEffect,useContext} from "react";
import Button from 'react-bootstrap/Button';
import { AiOutlinePlus, AiOutlineMinus } from "react-icons/ai";
import { VscIssueReopened } from "react-icons/vsc";
import Form from 'react-bootstrap/Form';
import { NotesContext } from "../App";
import { v4 as uuid } from 'uuid';
function TodoForm() {
    const unique_id = uuid();
    const initialInputData = {title:'', date:'', status:false};
    const initialErrorMessage = {};
    const [inputData,setInputData]=useState(initialInputData);
    const [errorMessage,setErrorMessage]=useState(initialErrorMessage);
    const [todoFormOpenState,setTodoFormOpenState]=useState(false);
    const [formIsSubmit, setFormIsSubmit]= useState(false);
    const [searchByDate, setSearchByDate]= useState('');
    const [editForm, setEditForm] = useState(false);

    const notesContextData = useContext(NotesContext);
    const editableFormData = notesContextData.EditableFormData;
    

    useEffect(() => {
        if (Object.keys(editableFormData).length > 0) {
            setEditForm(true);
            setTodoFormOpenState(true);  
            setSearchByDate('');
            setInputData((prev)=>{
                return {...prev, title:editableFormData.title,date:editableFormData.date};
            });
        }
      }, [editableFormData]);
    


    const todoFormOpenCloseHandler=()=>{
        
        if(searchByDate){
            setSearchByDate('');
        }
        
        if(!todoFormOpenState){
            setTodoFormOpenState(true);
        }
        if(todoFormOpenState){
            setTodoFormOpenState(false);
        }
    }

    const inputChangeHandler=(event)=>{
        const {name,value} = event.target;
        setInputData((prev)=>{
            return {...prev, [name]:value};
        }); 
        setErrorMessage((prev)=>{
            return {...prev,[name]:''};
        });
        // console.log(inputData);
    }

    const todoFormSubmitHandler = (event)=>{
        event.preventDefault();
        formValidation(inputData);
        setFormIsSubmit(true);  
    }

    useEffect(() => {
        if (Object.keys(errorMessage).length === 0 && formIsSubmit && !editForm) {
            notesContextData.onAdd({...inputData, id:unique_id});  
            setInputData(initialInputData);
            setTodoFormOpenState(false); //close the form
        }

        if (Object.keys(errorMessage).length === 0 && formIsSubmit && editForm) {
            notesContextData.onEdit(inputData);
            setEditForm(false);
            setInputData(initialInputData);
            setTodoFormOpenState(false); //close the form
        }
        
      }, [errorMessage]);

    const formValidation =(formData)=>{
        const errorMessageBag ={};
        if(formData.date === ''){
            errorMessageBag.date="Date is required";
        }
        if(formData.title === ''){
            errorMessageBag.title="Title is required";
        }
        setErrorMessage(errorMessageBag); 
    }

    const searchByDateHandler=(event)=>{
        setSearchByDate(event.target.value);
        notesContextData.onFilter(event.target.value);
    }

    const getAllListHandler=()=>{
        setSearchByDate('');
        setTodoFormOpenState(false); 
        notesContextData.onRefresh();
    }

    return (
        <>
            <div className="formContainer">
                <div className="list_action_container">
                    <div className="search_list">
                        <Form.Control className="filterListByDate" type="date"  value={searchByDate} onChange={searchByDateHandler} /> 
                        <p>filter by date</p>
                    </div>
                    <div className="show_all_list" onClick={getAllListHandler}>
                        <VscIssueReopened/>
                    </div>
                    <div className="form_handel_btn">
                        <button className="form_open_Close_btn" onClick={todoFormOpenCloseHandler} >{!todoFormOpenState ? (<AiOutlinePlus/>): (<AiOutlineMinus/>)}</button>
                    </div>
                </div>
                
                <div className={`todoForm bg-secondary bg-gradient ${!todoFormOpenState?'form-close':'form-open'} `}>
                    <Form method="post" id="todo-form" onSubmit={todoFormSubmitHandler}>
                        <Form.Group className="mb-3">
                            <Form.Label>Date</Form.Label>
                            <Form.Control type="date" name="date" onChange={inputChangeHandler} value={inputData.date} className={errorMessage.date?'invalid':''} />
                            <span className="error-msg">{errorMessage.date}</span>
                            
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Todo</Form.Label>
                            <textarea className={`form-control ${errorMessage.title?'invalid':''}`} name="title" rows="5" placeholder="What's the plan for Today...." onChange={inputChangeHandler}  value={inputData.title}/>
                            <span className="error-msg">{errorMessage.title}</span>
                        </Form.Group>
                        <Button className="todo-form-submit" variant="primary" type="submit">
                           {editForm?'Edit':'Submit'} 
                        </Button>
                    </Form>

                </div>
            </div>
        </>
    );

}
export default TodoForm;