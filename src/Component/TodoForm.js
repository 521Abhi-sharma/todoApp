import React,{useState,useEffect} from "react";
import Button from 'react-bootstrap/Button';
import { AiOutlinePlus, AiOutlineMinus } from "react-icons/ai";
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { icon } from '@fortawesome/fontawesome-svg-core/import.macro';

import Form from 'react-bootstrap/Form';
function TodoForm(props) {
    const initialInputData = {title:'', date:'', status:false};
    const initialErrorMessage = {};
    const [inputData,setInputData]=useState(initialInputData);
    const [errorMessage,setErrorMessage]=useState(initialErrorMessage);
    const [todoFormOpenState,setTodoFormOpenState]=useState(false);
    const [formIsSubmit, setFormIsSubmit]= useState(false);
    const [searchByDate, setSearchByDate]= useState('');
    const [editForm, setEditForm] = useState(false);

    useEffect(() => {
        if (Object.keys(props.editNoteData).length > 0) {
            setEditForm(true);
            setTodoFormOpenState(true);  
            setInputData((prev)=>{
                return {...prev, title:props.editNoteData.title,date:props.editNoteData.date};
            });
        }
      }, [props.editNoteData]);
    


    const todoFormOpenCloseHandler=()=>{
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
            props.collectFormData({...inputData, id:new Date().valueOf()});
            setInputData(initialInputData);
            setTodoFormOpenState(false); //close the form
        }

        if (Object.keys(errorMessage).length === 0 && formIsSubmit && editForm) {
            props.collectEditFormData(inputData);
            setEditForm(false);
            setInputData(initialInputData);
            setTodoFormOpenState(false); //close the form
        }
        
      }, [errorMessage]);

    const formValidation =(formData)=>{
        const errorMessageBag ={};
        if(formData.date === ''){
            errorMessageBag.date="date is required";
        }
        if(formData.title === ''){
            errorMessageBag.title="title is required";
        }
        setErrorMessage(errorMessageBag); 
    }

    const searchByDateHandler=(event)=>{
        setSearchByDate(event.target.value);
        props.filterNOteBookData(event.target.value);
    }

    return (
        <>
            <div className="formContainer">
                <div className="from_collaps_button">
                    <Form.Control className="searchByDateFilter" type="date" placeholder="search by date" value={searchByDate} onChange={searchByDateHandler} />
                    <Button className="from-open-close-btn" onClick={todoFormOpenCloseHandler} >{!todoFormOpenState ? (<AiOutlinePlus/>): (<AiOutlineMinus/>)}</Button>
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