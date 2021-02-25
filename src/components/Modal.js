import React, { Component } from "react";
import "./Modal.css";
import Rodal from 'rodal';
import 'rodal/lib/rodal.css';
import logo from '../assets/logo.png'
class Modal extends Component {

    render() {
        let buttons =
            <div className="modalButtons">
                <button className="btn-submit" onClick={this.props.ok} aria-label="OK">Ok</button>
            </div>

        if (this.props.type === "yesno") {
            buttons =
                <div className="modalButtons">
                    <button className="btn-submit" onClick={this.props.handleYes} aria-label="Sim">Sim</button>
                    <button className="btn-submit no-btn" onClick={this.props.hide} aria-label="Não">Não</button>
                </div>
        }

        return (
            <Rodal visible={this.props.visible} onClose={this.props.hide}>
                <div className="modalBody">
                    <img alt="logo" src={logo} />
                    <div className="modalHeader">
                        <h4 className="modalTitle">{this.props.title}</h4>
                    </div>
                    <div className="modalContent">
                        <p>{this.props.message}</p>
                        {buttons}
                    </div>
                </div>
            </Rodal>
        );
    }
}

export default Modal;