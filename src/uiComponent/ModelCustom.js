import React from "react";
import ReactDom from "react-dom";
import Button from 'react-bootstrap/Button';
const Popup = (props) => {
    return (
        <React.Fragment>
            <div className={`model-main ${props.openstate ? 'model-open' : ''}`} >
                <div className="model-backdrop">
                <div className="model">
                    <div className="model-title"><h4>{props.title}</h4></div>
                    <div className="model-body">
                        <p>{props.message}</p>
                    </div>
                    <div className="model-footer">
                        <Button className="close-model" onClick={props.close}>NO </Button>{' '}
                        <Button className="success-model" onClick={props.success} >YES </Button>
                    </div>
                </div>
                </div>
            </div>
        </React.Fragment>
    );
}

function ModelCustom(props) {
    return (
        ReactDom.createPortal(<Popup openstate={props.openstate} title={props.title} message={props.message} close={props.close} success={props.success} /> , document.getElementById('popup-drawer'))
        
    );
}

export default ModelCustom;