import React, { Component } from "react";
import "./EditPassword.css";
import api from "../services/api"
import handle from "../services/handleError"
import { Redirect } from "react-router-dom";
import Loading from "./Loading";
import Modal from "./Modal";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpinner } from '@fortawesome/free-solid-svg-icons'
class EditPassword extends Component {


    async componentDidMount() {

    }

    state = {
        oldPassword: "",
        newPassword: "",
        newConfirmationPassword: "",
        showGenericModal: false,
        genericModalMessage: "",
        redirect: false,
        loading: false
    }

    submit = e => {
        e.preventDefault();
        this.setState({ loading: true }, this.handleSubmit)
    }

    handleSubmit = async () => {

        const body = {
            oldPassword: this.state.oldPassword,
            newPassword: this.state.newPassword,
            newConfirmationPassword: this.state.newConfirmationPassword
        }

        const [, err] = await handle(api.put("changePassword", body));
        if (err) this.setState({ loading: false, showGenericModal: true, genericModalMessage: err.data ? (typeof (err.data.message) === "string" ? err.data.message : "Erro") : "Erro" })
        else {
            this.setState({ redirect: true, loading: false })
        }
    }

    handleInput = (e, name) => {
        this.setState({ [name]: e.target.value })
    }

    hideModal = async () => {
        this.setState({ showGenericModal: false })
    }
    
    render() {
        if (this.state.loading) {
            return (
                <div className="pageWrapper">
                    <Loading />
                </div>
            )
        } else {
            return (
                <div className="pageWrapper">
                    {this.state.redirect ? <Redirect to="/home" /> : null}
                    <div className="pageHeader">
                        <h5 className="pageTitle">Super Usuários</h5>
                    </div>
                    <div className="contentWrapper">
                        <div className="cardWrapper">
                            <h1 className="cardTitle">Atualizar senha do Super Usuário</h1>
                            <form>
                                <label>
                                    <p className="box-label">Senha antiga</p>
                                    <input type="password" name="oldPassword" value={this.state.oldPassword} onChange={(e) => this.handleInput(e, "oldPassword")} placeholder="Senha antiga" />
                                </label>
                                <label>
                                    <p className="box-label">Senha nova</p>
                                    <input type="password" name="newPassword" value={this.state.newPassword} onChange={(e) => this.handleInput(e, "newPassword")} placeholder="Senha nova" />
                                </label>
                                <label>
                                    <p className="box-label">Confirme a senha nova</p>
                                    <input type="password" name="newConfirmationPassword" value={this.state.newConfirmationPassword} onChange={(e) => this.handleInput(e, "newConfirmationPassword")} placeholder="Confirme a senha nova" />
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
}

export default EditPassword;
