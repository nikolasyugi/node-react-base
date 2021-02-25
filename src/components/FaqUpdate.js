import React, { Component } from "react";
import "./FaqUpdate.css";
import api from "../services/api"
import handle from "../services/handleError"
import { Redirect } from "react-router-dom";
import Loading from "./Loading";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import Modal from "./Modal";

class FaqUpdate extends Component {


    async componentDidMount() {

        this.setState({ id: this.props.match.params.faqId, loading: true });
        this.getFaq();
    }

    state = {
        id: "",
        question: "",
        answer: "",
        loading: true,
        loadingSubmit: false,
        redirect: false,
        showGenericModal: false,
        genericModalMessage: ""
    }

    hideModal = async () => {
        this.setState({ showGenericModal: false })
    }

    getFaq = async () => {
        const [response, err] = await handle(api.get(`faqs/${this.props.match.params.faqId}`));
        if (err) this.setState({ loading: true, showGenericModal: true, genericModalMessage: err.data ? (typeof (err.data.message) === "string" ? err.data.message : "Erro") : "Erro" })
        else {
            this.setState({ question: response.data.question, answer: response.data.answer, loading: false })
        }
    }

    submit = e => {
        e.preventDefault();
        this.setState({ loadingSubmit: true }, this.handleSubmit)
    }

    handleSubmit = async () => {

        const body = {
            id: this.state.id,
            question: this.state.question,
            answer: this.state.answer,
        }

        const [, err] = await handle(api.put('faqs', body));
        if (err) this.setState({ loading: false, showGenericModal: true, genericModalMessage: err.data ? (typeof (err.data.message) === "string" ? err.data.message : "Erro") : "Erro" })
        else this.setState({ redirect: true, loading: false })
    }

    handleInput = (e, name) => {
        this.setState({ [name]: e.target.value })
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
                    {this.state.redirect ? <Redirect to="/faqs" /> : null}
                    <div className="pageHeader">
                        <h5 className="pageTitle">Faqs</h5>
                    </div>
                    <div className="contentWrapper">
                        <div className="cardWrapper">
                            <h1 className="cardTitle">Atualizar dados da faq</h1>
                            <form>
                                <label>
                                    <p className="box-label">Pergunta</p>
                                    <input type="text" autoComplete="off" name="question" value={this.state.question} onChange={(e) => this.handleInput(e, "question")} placeholder="Pergunta" />
                                </label>
                                <label>
                                    <p className="box-label">Resposta</p>
                                    <input type="text" autoComplete="off" name="answer" value={this.state.answer} onChange={(e) => this.handleInput(e, "answer")} placeholder="Resposta" />
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

export default FaqUpdate;
