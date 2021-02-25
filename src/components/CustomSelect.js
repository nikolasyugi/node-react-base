import React, { Component } from "react";
import Select from 'react-select';

const customStyles = {
    control: (styles, state) => ({
        ...styles,
        boxShadow: state.isFocused ? "0 1px 5px rgba(0, 0, 0, 0.3)" : 0,
        borderColor: state.isFocused ? "var(--primary)" : "#f1f1f1",
        "&:hover": {
            borderColor: state.isFocused ? "var(--primary)" : "#f1f1f1"
        },
        padding: '5px'
    })
};

class CustomSelect extends Component {

    async componentDidMount() {
    }

    render() {
        return (
            <Select styles={customStyles} value={this.props.value} placeholder={this.props.placeholder} isMulti={true} options={this.props.options} onChange={this.props.onChange}></Select>
        );
    }

}

export default CustomSelect;