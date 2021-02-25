import React, { Component } from "react";
import "./Loading.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpinner } from '@fortawesome/free-solid-svg-icons'
class Loading extends Component {

    async componentDidMount() {
    }

    render() {
        return (
            <div className="loadingWrapper">
                <FontAwesomeIcon className="spinner" size={'6x'} icon={faSpinner}></FontAwesomeIcon>
            </div>
        );
    }

}

export default Loading;
