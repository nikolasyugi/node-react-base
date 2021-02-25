import React, { Component } from "react";
import "./UserCreate.css";
import api from "../services/api"
import handle from "../services/handleError"
import { Redirect } from "react-router-dom";
import InputMask from "react-input-mask";
import Modal from "./Modal";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpinner } from '@fortawesome/free-solid-svg-icons'
import moment from 'moment';
class UserCreate extends Component {


    async componentDidMount() {
    }

    state = {
        name: "",
        email: "",
        address: "",
        password: "",
        phone: "",
        birthday: "",
        degree: "",
        job: "",
        workload: "",
        picture: null,
        showGenericModal: false,
        genericModalMessage: "",
        loading: false,
    }

    submit = e => {
        e.preventDefault();
        this.setState({ loading: true }, this.handleSubmit)
    }

    handleSubmit = async () => {
        const formData = new FormData();

        const config = {
            headers: {
                'content-type': 'multipart/form-data',
            }
        }

        formData.append(`name`, this.state.name);
        formData.append(`email`, this.state.email);
        formData.append(`password`, this.state.password);
        formData.append(`address`, this.state.address);
        formData.append(`phone`, this.state.phone);
        formData.append(`birthday`, moment(this.state.birthday, "DD/MM/YYYY").toDate());
        formData.append(`picture`, this.state.picture);

        const [, err] = await handle(api.post('users', formData, config));
        if (err) {
            this.setState({ loading: false, showGenericModal: true, genericModalMessage: err.data ? (typeof (err.data.message) === "string" ? err.data.message : "Erro") : "Erro" })
        } else this.setState({ redirect: true, loading: false })
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
        return (
            <div className="pageWrapper">
                {this.state.redirect ? <Redirect to="/users" /> : null}
                <div className="pageHeader">
                    <h5 className="pageTitle">Membros</h5>
                </div>
                <div className="contentWrapper">
                    <div className="cardWrapper">
                        <h1 className="cardTitle">Adicionar Membro</h1>
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
                                <p className="box-label">Senha</p>
                                <input type="password" name="password" value={this.state.password} onChange={(e) => this.handleInput(e, "password")} placeholder="Senha" />
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

export default UserCreate;
