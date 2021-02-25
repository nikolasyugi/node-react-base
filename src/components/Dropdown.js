import React, { Component } from "react";
import "./Dropdown.css";
import { NavLink } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronDown } from '@fortawesome/free-solid-svg-icons'
import Modal from "./Modal";
import api from "../services/api"
import handle from "../services/handleError"

class Dropdown extends Component {

    constructor(props) {
        super(props);
        this.setWrapperRef = this.setWrapperRef.bind(this);
        this.handleClickOutside = this.handleClickOutside.bind(this);
    }

    state = {
        clicked: false,
        showModal: false,
        selected: null
    }

    handleRemove = async (state) => {
        this.setState({ clicked: false, showModal: true, selected: state })
    }

    handleExtraClick = async (state) => {
        this.setState({ clicked: false, selected: state }, this.props.extra(state))
    }
    render() {

        /***** Extra Menu *****/
        let extraMenu = null
        if (typeof this.props.extra == 'string' && this.props.extraDescription) { //redirect to route on click
            extraMenu = <NavLink className="dropdown-item" exact to={this.props.extra} onClick={() => this.setState({ clicked: false })}>{this.props.extraDescription}</NavLink>
        } else if (typeof this.props.extra == 'function' && this.props.extraDescription) { //run function on click
            extraMenu = <li className="dropdown-item" onClick={() => this.handleExtraClick(this.props.state)}>{this.props.extraDescription}</li>
        }
        /***** Extra Menu *****/

        return (
            this.state.clicked ?
                <div className="options-dropdown opened">
                    <ul ref={this.setWrapperRef}>
                        {this.props.details ? <NavLink className="dropdown-item" exact to={`/${this.props.details}/details/${this.props.state._id}`} onClick={() => this.setState({ clicked: false })}>Detalhes</NavLink> : null}
                        {this.props.update ? <NavLink className="dropdown-item" exact to={`/${this.props.update}/update/${this.props.state._id}`} onClick={() => this.setState({ clicked: false })}>Editar</NavLink> : null}
                        {this.props.remove ? <li className="dropdown-item" onClick={() => this.handleRemove(this.props.state)}>Remover</li> : null}
                        {extraMenu}
                    </ul>
                    {this.state.showModal ? <Modal title="Atenção" message="Tem certeza que deseja remover este item?" visible={this.state.showModal} handleYes={this.handleYes.bind(this)} type="yesno" hide={this.hideModal} /> : null}
                </div>
                :
                <div className="options-dropdown">
                    {this.state.showModal ? <Modal title="Atenção" message="Tem certeza que deseja remover este item?" visible={this.state.showModal} handleYes={this.handleYes} type="yesno" hide={this.hideModal} /> : null}
                    <button onClick={() => this.setState({ clicked: true })} className="options-btn">Opções<FontAwesomeIcon className="chevron-down" icon={faChevronDown} /></button>
                </div>
        )
    };

    /***** Close dropdown on click anywhere *****/
    componentDidMount() {
        document.addEventListener('mousedown', this.handleClickOutside);
    }
    componentWillUnmount() {
        document.removeEventListener('mousedown', this.handleClickOutside);
    }
    setWrapperRef(node) {
        this.wrapperRef = node;
    }
    handleClickOutside(event) {
        if (this.wrapperRef && !this.wrapperRef.contains(event.target)) {
            this.setState({ clicked: false })
        }
    }
    /***** Close dropdown on click anywhere *****/

    /***** Modal *****/
    handleYes = async () => {
        const [, err] = await handle(api.delete(`${this.props.remove}/${this.state.selected._id}`));
        if (err) alert(err)
        else {
            window.location.reload(false);
        }
    }
    hideModal = async () => {
        this.setState({ showModal: false })
    }
    /***** Modal *****/

}

export default Dropdown;