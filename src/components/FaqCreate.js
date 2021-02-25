import React, { Component } from "react";
import "./FaqCreate.css";
import api from "../services/api"
import handle from "../services/handleError"
import { Redirect } from "react-router-dom";
import Modal from "./Modal";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpinner } from '@fortawesome/free-solid-svg-icons'
import Loading from "./Loading";

class FaqCreate extends Component {


    async componentDidMount() {
    }

    state = {
        question: "",
        answer: "",
        loading: false,
        loadingSubmit: false,
        showGenericModal: false,
        genericModalMessage: ""
    }

    submit = e => {
        e.preventDefault();
        this.setState({ loadingSubmit: true }, this.handleSubmit)
    }

    handleSubmit = async () => {

        const body = {
            question: this.state.question,
            answer: this.state.answer,
        }

        const [, err] = await handle(api.post('faqs', body));
        if (err) this.setState({ loading: false, showGenericModal: true, genericModalMessage: err.data ? (typeof (err.data.message) === "string" ? err.data.message : "Erro") : "Erro" })
        else this.setState({ redirect: true, loading: false })
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
                    {this.state.redirect ? <Redirect to="/faqs" /> : null}
                    <div className="pageHeader">
                        <h5 className="pageTitle">Faqs</h5>
                    </div>
                    <div className="contentWrapper">
                        <div className="cardWrapper">
                            <h1 className="cardTitle">Adicionar Faq</h1>
                            <form>
                                <label>
                                    <p className="box-label">Pergunta</p>
                                    <input type="text" name="question" autoComplete="off" value={this.state.question} onChange={(e) => this.handleInput(e, "question")} placeholder="Pergunta" />
                                </label>
                                <label>
                                    <p className="box-label">Resposta</p>
                                    <input type="text" name="answer" autoComplete="off" value={this.state.answer} onChange={(e) => this.handleInput(e, "answer")} placeholder="Resposta" />
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

export default FaqCreate;
