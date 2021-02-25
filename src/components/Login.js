import React, { Component } from "react";
import Rodal from 'rodal';
import api from "../services/api"
import handle from "../services/handleError"
import { Redirect } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpinner } from '@fortawesome/free-solid-svg-icons'
import "./Login.css";
import Modal from "./Modal";

class Login extends Component {

    constructor(props) {
        super(props);
        this.state = {
            login: "",
            password: "",
            email: "",
            showModal: false,
            showGenericModal: false,
            genericModalMessage: "",
            redirect: false,
            loading: true,
            loadingSubmit: false
        }
    }

    componentDidMount() {
        if (localStorage.getItem('user')) window.location.replace('/home')
        else this.setState({ loading: false })
    }

    hideModal = async () => {
        this.setState({ showModal: false, showGenericModal: false })
    }

    handleForgotModal = () => {
        this.setState({ showModal: true })
    }

    submitForgot = e => {
        this.setState({ loadingSubmit: true }, this.handleForgotSubmit)
    }

    handleForgotSubmit = async () => {

        const body = {
            email: this.state.email
        }

        const [, err] = await handle(api.post("resetPassword", body));
        if (err) this.setState({ loadingSubmit: false, showModal: false, showGenericModal: true, genericModalMessage: err.data ? (typeof (err.data.message) === "string" ? err.data.message : "Erro") : "Erro" })
        else {
            this.setState({ loadingSubmit: false, showModal: false })
        }
    }

    submit = e => {
        e.preventDefault();
        this.setState({ loadingSubmit: true }, this.handleSubmit)
    }

    handleSubmit = async () => {
        const body = {
            email: this.state.login,
            password: this.state.password,
        }
        const [response, err] = await handle(api.post("sign_in", body));
        if (err) this.setState({ loadingSubmit: false, showGenericModal: true, genericModalMessage: err.data ? (typeof (err.data.message) === "string" ? err.data.message : "Erro") : "Erro" })
        else {
            localStorage.setItem('user', JSON.stringify(response.data))
            this.setState({ loadingSubmit: false, redirect: true })
        }
    }

    handleInput = (e, name) => {
        this.setState({ [name]: e.target.value })
    }

    render() {
        return (
            <>
                {!this.state.loading ?
                    <div id="page-bk">
                        {this.state.redirect ? <Redirect to="/home" /> : null}
                        <div id="login-body">
                            <form className="box">
                                <h2>Gerenciamento LoremIpsum</h2>
                                <label>
                                    <input autoFocus type="email" name="login" value={this.state.login} onChange={(e) => this.handleInput(e, "login")} placeholder="LOGIN" />
                                </label>
                                <label>
                                    <input type="password" name="password" value={this.state.password} onChange={(e) => this.handleInput(e, "password")} placeholder="SENHA" />
                                </label>
                                <p id="forgot" onClick={this.handleForgotModal.bind(this)}>Esqueci a senha</p>
                                {this.state.loadingSubmit ?
                                    <button disabled={true} className="submit-btn-disabled">Enviar&nbsp;<FontAwesomeIcon className="spinner" icon={faSpinner}></FontAwesomeIcon></button>
                                    :
                                    <button onClick={this.submit} className="submit-btn">Enviar</button>
                                }
                            </form>
                            <Modal title="Ops!" message={this.state.genericModalMessage} visible={this.state.showGenericModal} ok={this.hideModal.bind(this)} hide={this.hideModal.bind(this)} />
                            <Rodal height={300} visible={this.state.showModal} onClose={this.hideModal}>
                                <div className="modalBody">
                                    <div className="modalHeader">
                                        <h4 className="modalTitle">Recuperação de senha</h4>
                                    </div>
                                    <div className="modalContent">
                                        <p>Insira o e-mail abaixo para recuperar a sua senha</p>
                                        <label className="inputWrapper">
                                            <input type="email" name="email" value={this.state.email} onChange={(e) => this.handleInput(e, "email")} placeholder="E-mail" />
                                        </label>
                                        <div>
                                            {this.state.loadingSubmit ?
                                                <button disabled={true} className="submit-btn-disabled">Enviar e-mail&nbsp;<FontAwesomeIcon className="spinner" icon={faSpinner}></FontAwesomeIcon></button>
                                                :
                                                <button onClick={this.submitForgot.bind(this)} className="submit-btn">Enviar e-mail</button>
                                            }
                                        </div>
                                    </div>
                                </div>
                            </Rodal>
                        </div >
                    </div >
                    :
                    null
                }
            </>
        );
    }

}

export default Login;
