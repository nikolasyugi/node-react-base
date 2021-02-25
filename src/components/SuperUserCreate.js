import React, { Component } from "react";
import "./SuperUserCreate.css";
import api from "../services/api"
import handle from "../services/handleError"
import { Redirect } from "react-router-dom";
import InputMask from "react-input-mask";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpinner } from '@fortawesome/free-solid-svg-icons'
import Modal from "./Modal";

class SuperUserCreate extends Component {


    async componentDidMount() {
    }

    state = {
        name: "",
        email: "",
        phone: "",
        password: "",
        loading: false,
        showGenericModal: false,
        genericModalMessage: ""
    }

    submit = e => {
        e.preventDefault();
        this.setState({ loading: true }, this.handleSubmit)
    }

    handleSubmit = async () => {

        const body = {
            name: this.state.name,
            email: this.state.email,
            phone: this.state.phone,
            password: this.state.password,
        }

        const [, err] = await handle(api.post('superUsers', body));
        if (err) this.setState({ loading: false, showGenericModal: true, genericModalMessage: err.data ? (typeof (err.data.message) === "string" ? err.data.message : "Erro") : "Erro" })
        else this.setState({ redirect: true, loading: false })
    }

    handleInput = (e, name) => {
        this.setState({ [name]: e.target.value })
    }

    hideModal = async () => {
        this.setState({ showGenericModal: false })
    }

    render() {
        return (
            <div className="pageWrapper">
                {this.state.redirect ? <Redirect to="/superUsers" /> : null}
                <div className="pageHeader">
                    <h5 className="pageTitle">Super Usuários</h5>
                </div>
                <div className="contentWrapper">
                    <div className="cardWrapper">
                        <h1 className="cardTitle">Adicionar Super Usuário</h1>
                        <form>
                            <label>
                                <p className="box-label">Nome</p>
                                <input type="text" name="name" value={this.state.name} onChange={(e) => this.handleInput(e, "name")} placeholder="Nome" />
                            </label>
                            <label>
                                <p className="box-label">E-mail</p>
                                <input type="text" name="email" value={this.state.email} onChange={(e) => this.handleInput(e, "email")} placeholder="E-mail" />
                            </label>
                            <label>
                                <p className="box-label">Telefone</p>
                                <InputMask mask="(99) 9 9999 9999" type="text" name="phone" value={this.state.phone} onChange={(e) => this.handleInput(e, "phone")} placeholder="Telefone" />
                            </label>
                            <label>
                                <p className="box-label">Senha</p>
                                <input type="password" name="password" value={this.state.password} onChange={(e) => this.handleInput(e, "password")} placeholder="Senha" />
                            </label>
                            <div className="submit-btn-wrapper">
                                {this.state.loading ?
                                    <button disabled={true} className="submit-btn-disabled">Enviar&nbsp;<FontAwesomeIcon className="spinner" icon={faSpinner}></FontAwesomeIcon></button>
                                    :
                                    <button onClick={this.submit} className="submit-btn">Enviar</button>
                                }
                            </div>
                        </form>
                        <Modal title="Ops!" message={this.state.genericModalMessage} visible={this.state.showGenericModal} ok={this.hideModal.bind(this)} hide={this.hideModal.bind(this)} />
                    </div>
                </div>
            </div>
        );
    }

}

export default SuperUserCreate;
