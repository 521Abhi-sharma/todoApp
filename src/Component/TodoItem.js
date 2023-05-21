import React , { useState } from "react";
import Button from 'react-bootstrap/Button';
import { AiFillEdit,AiFillDelete } from "react-icons/ai";
import { TfiCheck, TfiLoop} from "react-icons/tfi";
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { icon } from '@fortawesome/fontawesome-svg-core/import.macro';
import Badge from 'react-bootstrap/Badge';
import ModelCustom from '../uiComponent/ModelCustom';
function TodoItem(props) {
    const [deletePopupStatus, setDeletePopupStatus] = useState(false);
    const [selectedNoteId, setSelectedNoteId] = useState('');
    const closePopup = () => {
        setDeletePopupStatus(false);
    }

    const sucessPopup = () => {
        setDeletePopupStatus(false);
        props.Delete(selectedNoteId);
    }

    const todoDone = (todoId) => {
        props.Done(todoId);
    }

    const todoUndo =  (todoId) => {
        props.Undo(todoId);
        // console.log('code is here');
    }

    const todoEdit = (todoId) => {
        props.getNoteData(todoId);
    }

    const todoDelete = (todoId) => {
        setSelectedNoteId(todoId);
        setDeletePopupStatus(true);
    }

    return (
        <React.Fragment>
            {
                (deletePopupStatus) &&  <ModelCustom openstate={deletePopupStatus} title={'delete selected note'} message={'do you want delete note? make sure you can not revert this.'} close={closePopup} success={sucessPopup}/>          
            }
            <div className="bg-secondary bg-gradient todo_item">
                <div className="todo_date">
                    <Badge bg="secondary">
                        {props.listItem.date}
                    </Badge>{' '}
                </div>
                <div className="todo_title">
                    <p className={props.listItem.status ? 'task-done' : 'fail'}>{props.listItem.title}</p>
                </div>
                <div className="item-btns">
                    {!props.listItem.status? <Button className="done-btn" onClick={() => { todoDone(props.listItem.id) }}><TfiCheck/></Button>:
                    <Button className="undo-btn" onClick={() => { todoUndo(props.listItem.id) }}><TfiLoop/></Button>
                    }
                    {' '}
                    {!props.listItem.status? <Button className="edit-btn" onClick={() => { todoEdit(props.listItem.id) }} ><AiFillEdit/></Button>:''}
                    {' '}
                    <Button className="delete-btn" onClick={() => { todoDelete(props.listItem.id) }} ><AiFillDelete/></Button>
                </div>
            </div>
        </React.Fragment>
    );
}
export default TodoItem;