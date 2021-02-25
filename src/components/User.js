import React, { Component } from "react";
import "./User.css";
import Dropdown from "./Dropdown.js";
import CustomDataTable from "./CustomDataTable.js";
import { NavLink } from "react-router-dom";
import api from "../services/api";
import handle from "../services/handleError";
import Loading from "./Loading";
import Modal from './Modal';

class User extends Component {

    constructor() {
        super();
        this.state = {
            data: [],
            user: "",
            loading: true,
            showGenericModal: false,
            genericModalMessage: ""
        }
    }
    async componentDidMount() {
        this.getUsers();
    }

    getUsers = async () => {
        const [response, err] = await handle(api.get("users"));
        if (err) this.setState({ loading: false, showGenericModal: true, genericModalMessage: err.data ? (typeof (err.data.message) === "string" ? err.data.message : "Erro") : "Erro" })
        else this.setState({ data: response.data, user: response.data.length ? response.data[0]._id : "", loading: false })
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
                    <div className="pageHeader">
                        <h5 className="pageTitle">Usuários</h5>
                    </div>
                    <div className="contentWrapper">
                        <div className="header-buttons">
                            <NavLink className="primary-link" exact to="/users/create">Adicionar usuário</NavLink>
                        </div>
                        <div className="cardWrapper">
                            <h1 className="cardTitle">Lista de Usuários</h1>
                            <CustomDataTable
                                columns={this.columns}
                                data={this.state.data}
                                filterFields={["name", "email"]}
                            />
                        </div>
                        <Modal title="Ops!" message={this.state.genericModalMessage} visible={this.state.showGenericModal} ok={this.hideModal.bind(this)} hide={this.hideModal.bind(this)} />
                    </div>
                </div>
            );
        }
    }

    columns = [
        {
            name: 'Nome',
            selector: 'name',
            sortable: true,
            center: true,
        },
        {
            name: 'E-mail',
            selector: 'email',
            sortable: true,
            center: true,
        },
        {
            name: 'Telefone',
            selector: 'phone',
            sortable: true,
            center: true,
        },
        {
            name: 'Opções',
            selector: 'options',
            cell: (state) =>
                <Dropdown details="users" update="users" remove="users" state={state} />

        }
    ];
}

export default User;
