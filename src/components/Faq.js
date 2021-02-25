import React, { Component } from "react";
import "./Faq.css";
import Dropdown from "./Dropdown.js";
import CustomDataTable from "./CustomDataTable.js";
import { NavLink } from "react-router-dom";
import api from "../services/api";
import handle from "../services/handleError";
import Loading from "./Loading";
import Modal from './Modal';

class Faq extends Component {

    constructor() {
        super();
        this.state = {
            data: [],
            faqs: [],
            loading: true,
            showGenericModal: false,
            genericModalMessage: ""
        }
    }
    async componentDidMount() {
        this.getFaqs();
    }

    hideModal = async () => {
        this.setState({ showGenericModal: false })
    }

    getFaqs = async () => {
        const [response, err] = await handle(api.get("faqs"));
        if (err) this.setState({ loading: false, showGenericModal: true, genericModalMessage: err.data ? (typeof (err.data.message) === "string" ? err.data.message : "Erro") : "Erro" })
        else this.setState({ data: response.data, loading: false })
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
                        <h5 className="pageTitle">Faqs</h5>
                    </div>
                    <div className="contentWrapper">
                        <NavLink className="primary-link" exact to="/faqs/create">Adicionar Faq</NavLink>
                        <div className="cardWrapper">
                            <h1 className="cardTitle">Lista de Faqs</h1>
                            <CustomDataTable
                                columns={this.columns}
                                data={this.state.data}
                                filterFields={["question", "answer"]}
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
            name: 'Pergunta',
            selector: 'question',
            sortable: true,
            center: true,
        },
        {
            name: 'Resposta',
            selector: 'answer',
            sortable: true,
            center: true,
        },
        {
            name: 'Opções',
            selector: 'options',
            cell: (state) =>
                <Dropdown details="faqs" update="faqs" remove="faqs" state={state} />

        }
    ];
}

export default Faq;
