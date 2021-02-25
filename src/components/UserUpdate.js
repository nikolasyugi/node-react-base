import React, { Component } from "react";
import "./UserUpdate.css";
import api from "../services/api"
import handle from "../services/handleError"
import { Redirect } from "react-router-dom";
import Loading from "./Loading";
import InputMask from "react-input-mask";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpinner } from '@fortawesome/free-solid-svg-icons'
import moment from 'moment';
import Modal from './Modal';
class UserUpdate extends Component {


    async componentDidMount() {

        this.setState({ id: this.props.match.params.userId, loading: true });
        this.getUser();
    }

    state = {
        name: "",
        address: "",
        phone: "",
        birthday: "",
        picture: null,
        id: "",
        loading: true,
        loadingSubmit: false,
        redirect: false,
        genericModalMessage: "",
        showGenericModal: false
    }

    getUser = async () => {
        const [response, err] = await handle(api.get(`users/${this.props.match.params.userId}`));
        if (err) this.setState({ loading: true, showGenericModal: true, genericModalMessage: err.data ? (typeof (err.data.message) === "string" ? err.data.message : "Erro") : "Erro" })
        else {
            this.setState({ name: response.data.name, address: response.data.address, phone: response.data.phone, birthday: response.data.birthday ? new Date(response.data.birthday).toLocaleDateString('pt-br') : null, picture: response.data.picture, loading: false })
        }
    }

    submit = e => {
        e.preventDefault();
        this.setState({ loadingSubmit: true }, this.handleSubmit)
    }

    handleSubmit = async (e) => {
        const formData = new FormData();

        const config = {
            headers: {
                'content-type': 'multipart/form-data',
            }
        }

        formData.append(`id`, this.state.id);
        formData.append(`name`, this.state.name);
        formData.append(`email`, this.state.email);
        formData.append(`address`, this.state.address);
        formData.append(`phone`, this.state.phone);
        formData.append(`birthday`, moment(this.state.birthday, "DD/MM/YYYY").toDate());
        formData.append(`picture`, this.state.picture);

        const [, err] = await handle(api.put('users', formData, config));
        if (err) this.setState({ loadingSubmit: false, showGenericModal: true, genericModalMessage: err.data ? (typeof (err.data.message) === "string" ? err.data.message : "Erro") : "Erro" })
        else {
            this.setState({ redirect: true, loadingSubmit: false })
        }
    }

    handleFile = async (e) => {
        this.setState({ picture: e.target.files[0] })
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
                    {this.state.redirect ? <Redirect to="/users" /> : null}
                    <div className="pageHeader">
                        <h5 className="pageTitle">Usuários</h5>
                    </div>
                    <div className="contentWrapper">
                        <div className="cardWrapper">
                            <h1 className="cardTitle">Atualizar dados do Usuário</h1>
                            <form>
                                <label>
                                    <p className="box-label">Nome</p>
                                    <input type="text" name="name" value={this.state.name} onChange={(e) => this.handleInput(e, "name")} placeholder="Nome" />
                                </label>
                                <label>
                                    <p className="box-label">Endereço</p>
                                    <input type="text" name="address" value={this.state.address} onChange={(e) => this.handleInput(e, "address")} placeholder="Endereço" />
                                </label>
                                <label>
                                    <p className="box-label">Telefone</p>
                                    <InputMask mask="(99) 9 9999 9999" type="text" name="phone" value={this.state.phone} onChange={(e) => this.handleInput(e, "phone")} placeholder="Telefone" />
                                </label>
                                <label>
                                    <p className="box-label">Data de Nascimento</p>
                                    <InputMask mask="99/99/9999" type="text" name="birthday" value={this.state.birthday} onChange={(e) => this.handleInput(e, "birthday")} placeholder="DD/MM/YYYY" />
                                </label>
                                <label>
                                    <p className="box-label">Imagem</p>
                                    <input className="fileInput" type="file" name="picture" onChange={this.handleFile} />
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

export default UserUpdate;
