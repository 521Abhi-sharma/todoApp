import React, { useEffect ,useState,useContext} from 'react';
import { NotesContext } from "../App";

const TimeTracker = () => {
    const notesContextData = useContext(NotesContext);
    const [timeTracker1, setTimeTracker1] = useState('00:00:00');
    //step1: make deadline
    const getDealLineTime = () => {
        // in this funciton i have added mint for making deadline
        let deadline = new Date();
        // console.log('time', deadline);
        // deadline.setSeconds(deadline.getSeconds() + 10);
        deadline.setMinutes(deadline.getMinutes() + 1);
        // console.log('time after add time', deadline);
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
        if (total >= 0) {

            // update the timer
            // check if less than 10 then we need to
            // add '0' at the beginning of the variable
            setTimeTracker1(
                (hours > 9 ? hours : '0' + hours) + ':' +
                (minutes > 9 ? minutes : '0' + minutes) + ':'
                + (seconds > 9 ? seconds : '0' + seconds)
            )
        }
        if (total === 0) {
            notesContextData.destroyData();
            trackerAction();
            // console.log('here run again');
        }
    }

    // step 5 make a fnction that trigger timmerFunctionality
    const trackerAction = () => {
        const deadline = getDealLineTime();
        setInterval(() => {
            startTimer(deadline);
        }, 1000);
    }


    useEffect(() => {
        trackerAction();
    }, []);

    return (
        <p>this is demo app, its destroy your data with in minutes{timeTracker1}</p>
    );
}
export default TimeTracker;