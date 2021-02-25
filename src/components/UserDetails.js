import React, { Component } from "react";
import "./UserDetails.css";
import api from "../services/api"
import handle from "../services/handleError"
import Loading from "./Loading";
import Modal from './Modal';
class userDetails extends Component {

    constructor() {
        super();
        this.state = {
            user: "",
            id: "",
            loading: true,
            showGenericModal: false,
            genericModalMessage: ""
        }
    }
    async componentDidMount() {
        this.setState({ id: this.props.match.params.userId, loading: true }, this.getuser);
    }

    getuser = async () => {
        const [response, err] = await handle(api.get(`users/${this.state.id}`));

        if (err) this.setState({ loading: true, showGenericModal: true, genericModalMessage: err.data ? (typeof (err.data.message) === "string" ? err.data.message : "Erro") : "Erro" })
        else this.setState({ user: response.data, loading: false })
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
                        <h5 className="pageTitle">Usuários</h5>
                    </div>
                    <div className="contentWrapper">
                        <div className="cardWrapper">
                            <h1 className="cardTitle">Detalhes do Usuário</h1>

                            <p className="fieldTitle"><b>Id</b></p>
                            <p className="fieldContent">{this.state.user._id}</p>
                            <br />
                            <p className="fieldTitle"><b>Nome</b></p>
                            <p className="fieldContent">{this.state.user.name}</p>
                            <br />
                            <p className="fieldTitle"><b>E-mail</b></p>
                            <p className="fieldContent">{this.state.user.email}</p>
                            <br />
                            <p className="fieldTitle"><b>Endereço</b></p>
                            <p className="fieldContent">{this.state.user.address}</p>
                            <br />
                            <p className="fieldTitle"><b>Telefone</b></p>
                            <p className="fieldContent">{this.state.user.phone}</p>
                            <br />
                            <p className="fieldTitle"><b>Data de Nascimento</b></p>
                            <p className="fieldContent">{this.state.user.birthday ? new Date(this.state.user.birthday).toLocaleDateString('pt-br') : null}</p>
                            <br />
                            <p className="fieldTitle"><b>Imagem</b></p>
                            {this.state.user.picture ?
                                <p className="fieldContent"><a target="_blank" rel="noreferrer" href={this.state.user.picture}> Ver arquivo</a></p>
                                :
                                <p className="fieldContent">Nenhum arquivo carregado</p>
                            }
                            <br />
                        </div>
                    </div>
                </div>
            );
        }
    }

}

export default userDetails;
