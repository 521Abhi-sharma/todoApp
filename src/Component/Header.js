import React from "react";
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
function Header({timeTracker}) {
  return (

    <Navbar bg="dark" variant="dark" sticky="top" >
      <Container>
        <Navbar.Brand href="#home">
          NoteBook
        </Navbar.Brand>
         
      </Container>
    </Navbar>
  );
}

export default Header;