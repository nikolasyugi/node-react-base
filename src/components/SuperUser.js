import React, { Component } from "react";
import "./SuperUser.css";
import Dropdown from "./Dropdown.js";
import CustomDataTable from "./CustomDataTable.js";
import { NavLink } from "react-router-dom";
import api from "../services/api";
import handle from "../services/handleError";
import Loading from "./Loading";
import Modal from './Modal';
class SuperUser extends Component {

    constructor() {
        super();
        this.state = {
            data: [],
            loading: true,
            showGenericModal: false,
            genericModalMessage: ""
        }
    }
    async componentDidMount() {
        this.getSuperUser();
    }

    getSuperUser = async () => {
        const [response, err] = await handle(api.get("superUsers"));
        if (err) this.setState({ loading: true, showGenericModal: true, genericModalMessage: err.data ? (typeof (err.data.message) === "string" ? err.data.message : "Erro") : "Erro" })
        else this.setState({ data: response.data, loading: false })
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
                    <div className="pageHeader">
                        <h5 className="pageTitle">Super Usuários</h5>
                    </div>
                    <div className="contentWrapper">
                        <div id="user-buttons">
                            <NavLink className="primary-link" exact to="/superUsers/create">Adicionar super usuário</NavLink>
                        </div>
                        <div className="cardWrapper">
                            <h1 className="cardTitle">Lista de Super Usuários</h1>
                            <CustomDataTable
                                columns={this.columns}
                                data={this.state.data}
                                filterFields={["name", "email"]}
                            />
                        </div>
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
                <Dropdown update="superUsers" remove="superUsers" state={state} />

        }
    ];
}

export default SuperUser;
