import React, { Component } from "react";
import Modal from "./Modal";
import api from "../services/api"
import handle from "../services/handleError"
import { Redirect } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpinner } from '@fortawesome/free-solid-svg-icons'

import "./ResetPassword.css";

class ResetPassword extends Component {

    constructor(props) {
        super(props);
        this.state = {
            newPassword: "",
            newConfirmationPassword: "",
            code: "",
            showModal: false,
            redirect: false,
            loading: false,
            showGenericModal: false,
            genericModalMessage: ""
        }
    }

    async componentDidMount() {
        let code = new URLSearchParams(window.location.search).get('code')
        this.setState({ code: code });
    }

    hideModal = async () => {
        this.setState({ showModal: false, showGenericModal: false })
    }

    submit = e => {
        e.preventDefault();
        this.setState({ loading: true }, this.handleSubmit)
    }

    handleSubmit = async () => {

        const body = {
            code: this.state.code,
            newPassword: this.state.newPassword,
            newConfirmationPassword: this.state.newConfirmationPassword,
        }
        const [, err] = await handle(api.put("password", body));
        if (err) this.setState({ loading: false, showGenericModal: true, genericModalMessage: err.data ? (typeof (err.data.message) === "string" ? err.data.message : "Erro") : "Erro" })
        else {
            this.setState({ showModal: true, loading: false })
        }
    }

    handleInput = (e, name) => {
        this.setState({ [name]: e.target.value })
    }

    redirectUser = () => {
        this.setState({ showModal: false, redirect: true })
    }

    render() {
        return (
            <div id="page-bk">
                {this.state.redirect ? <Redirect to="/" /> : null}
                <div id="login-body">
                    <form className="box">
                        <h2>Recuperação de Senha</h2>
                        <label>
                            <input type="password" name="password" value={this.state.newPassword} onChange={(e) => this.handleInput(e, "newPassword")} placeholder="SENHA" />
                        </label>
                        <label>
                            <input type="password" name="confirmPassword" value={this.state.newConfirmationPassword} onChange={(e) => this.handleInput(e, "newConfirmationPassword")} placeholder="CONFIRMAR SENHA" />
                        </label>
                        {this.state.loading ?
                            <button disabled={true} className="submit-btn-disabled">Enviar&nbsp;<FontAwesomeIcon className="spinner" icon={faSpinner}></FontAwesomeIcon></button>
                            :
                            <button onClick={this.submit} className="submit-btn">Enviar</button>
                        }
                    </form>
                    <Modal title="Ops!" message={this.state.genericModalMessage} visible={this.state.showGenericModal} ok={this.hideModal.bind(this)} hide={this.hideModal.bind(this)} />
                    {this.state.showModal ? <Modal title="Recuperação de senha" message="Senha alterada com sucesso!" visible={this.state.showModal} hide={this.hideModal} ok={this.redirectUser.bind(this)} /> : null}
                </div >
            </div >
        );
    }

}

export default ResetPassword;
