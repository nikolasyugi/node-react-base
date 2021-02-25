import React, { Component } from "react";
import "./SuperUserUpdate.css";
import api from "../services/api"
import handle from "../services/handleError"
import { Redirect } from "react-router-dom";
import Loading from "./Loading";
import InputMask from "react-input-mask";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpinner } from '@fortawesome/free-solid-svg-icons'
import Modal from './Modal';
class SuperUserUpdate extends Component {


    async componentDidMount() {

        this.setState({ id: this.props.match.params.superUserId, loading: true });
        this.getSuperUser();
    }

    state = {
        name: "",
        phone: "",
        id: "",
        loading: true,
        loadingSubmit: false,
        redirect: false
    }

    getSuperUser = async () => {
        const [response, err] = await handle(api.get(`superUsers/${this.props.match.params.superUserId}`));
        if (err) this.setState({ loading: true, showGenericModal: true, genericModalMessage: err.data ? (typeof (err.data.message) === "string" ? err.data.message : "Erro") : "Erro" })
        else {
            this.setState({ name: response.data.name, phone: response.data.phone, loading: false })
        }
    }
    submit = e => {
        e.preventDefault();
        this.setState({ loadingSubmit: true }, this.handleSubmit)
    }

    handleSubmit = async () => {
        const body = {
            id: this.state.id,
            name: this.state.name,
            phone: this.state.phone,
        }

        const [, err] = await handle(api.put("superUsers", body));
        if (err) this.setState({ loadingSubmit: false, showGenericModal: true, genericModalMessage: err.data ? (typeof (err.data.message) === "string" ? err.data.message : "Erro") : "Erro" })
        else this.setState({ redirect: true, loadingSubmit: false })
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
                    <Modal title="Ops!" message={this.state.genericModalMessage} visible={this.state.showGenericModal} ok={this.hideModal.bind(this)} hide={this.hideModal.bind(this)} />
                </div>
            )
        } else {
            return (
                <div className="pageWrapper">
                    {this.state.redirect ? <Redirect to="/superUsers" /> : null}
                    <div className="pageHeader">
                        <h5 className="pageTitle">Super Usuários</h5>
                    </div>
                    <div className="contentWrapper">
                        <div className="cardWrapper">
                            <h1 className="cardTitle">Atualizar dados do Super Usuário</h1>
                            <form>
                                <label>
                                    <p className="box-label">Nome</p>
                                    <input type="text" name="name" value={this.state.name} onChange={(e) => this.handleInput(e, "name")} placeholder="Nome" />
                                </label>
                                <label>
                                    <p className="box-label">Telefone</p>
                                    <InputMask mask="(99) 9 9999 9999" type="text" name="phone" value={this.state.phone} onChange={(e) => this.handleInput(e, "phone")} placeholder="Telefone" />
                                </label>
                                <div className="submit-btn-wrapper">
                                    {this.state.loadingSubmit ?
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

export default SuperUserUpdate;
