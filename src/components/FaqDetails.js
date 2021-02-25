import React, { Component } from "react";
import "./FaqDetails.css";
import api from "../services/api"
import handle from "../services/handleError"
import Loading from "./Loading";
import Modal from './Modal';
class FaqDetails extends Component {

    constructor() {
        super();
        this.state = {
            faq: "",
            id: "",
            loading: true,
            showGenericModal: false,
            genericModalMessage: ""
        }
    }
    async componentDidMount() {
        this.setState({ id: this.props.match.params.faqId, loading: true }, this.getFaq);
    }

    getFaq = async () => {
        const [response, err] = await handle(api.get(`faqs/${this.state.id}`));

        if (err) this.setState({ loading: true, showGenericModal: true, genericModalMessage: err.data ? (typeof (err.data.message) === "string" ? err.data.message : "Erro") : "Erro" })
        else this.setState({ faq: response.data, loading: false });
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
                        <h5 className="pageTitle">Faqs</h5>
                    </div>
                    <div className="contentWrapper">
                        <div className="cardWrapper">
                            <h1 className="cardTitle">Detalhes do Faq</h1>

                            <p className="fieldTitle"><b>Id</b></p>
                            <p className="fieldContent">{this.state.faq._id}</p>
                            <br />
                            <p className="fieldTitle"><b>Pergunta</b></p>
                            <p className="fieldContent">{this.state.faq.question}</p>
                            <br />
                            <p className="fieldTitle"><b>Resposta</b></p>
                            <p className="fieldContent">{this.state.faq.answer}</p>
                            <br />
                        </div>
                    </div>
                </div>
            );
        }
    }

}

export default FaqDetails;
