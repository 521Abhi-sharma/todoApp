import React, {useContext} from "react";
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import TimeTracker from "./TimeTracker";
import { NotesContext } from "../App";
function Header({timeTracker}) {
  const {notes} = useContext(NotesContext);
  return (

    <Navbar bg="dark" variant="dark" sticky="top" >
      <Container>
        <Navbar.Brand href="#home">
          NoteBook
        </Navbar.Brand>
        {notes.length >0 && (<TimeTracker/>) }
      </Container>
    </Navbar>
  );
}

export default Header;