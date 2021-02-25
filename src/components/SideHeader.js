import React, { Component } from "react";
import { NavLink } from "react-router-dom";

import "./SideHeader.css";

import logo from "../assets/logo.png";
import user from "../assets/user.png";
import home from "../assets/home.png";
import faq from "../assets/faq.png";
import superUser from "../assets/superUser.png";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars, faChevronDown, faLock, faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import Modal from "./Modal";
import { Redirect } from "react-router-dom";

class SideHeader extends Component {

    constructor(props) {
        super(props);
        this.setWrapperRef = this.setWrapperRef.bind(this);
        this.handleClickOutside = this.handleClickOutside.bind(this);
    }

    /***** Close dropdown on click anywhere *****/
    componentDidMount() {
        document.addEventListener('mousedown', this.handleClickOutside);
        this.setState({ user: JSON.parse(localStorage.getItem('user')) })
        this.menuMobile();
        window.addEventListener('resize', this.menuMobile);
    }
    componentWillUnmount() {
        document.removeEventListener('mousedown', this.handleClickOutside);
        window.removeEventListener('resize', this.menuMobile);
    }
    setWrapperRef(node) {
        this.wrapperRef = node;
    }
    handleClickOutside(event) {
        if (this.wrapperRef && !this.wrapperRef.contains(event.target)) {
            this.setState({ showDropdown: false })
        }
    }
    /***** Close dropdown on click anywhere *****/


    state = {
        showDropdown: false,
        user: null,
        isMobile: false,
        showMenu: true,
        showLogoutModal: false,
        redirect: false
    }

    toggleDropdown = () => {
        this.setState({ showDropdown: !this.state.showDropdown })
    }

    logout = async () => {
        localStorage.clear();
        this.setState({ redirect: true })
    }

    openLogoutModal = async () => {
        this.setState({ showLogoutModal: true, showDropdown: false })
    }

    hideModal = async () => {
        this.setState({ showLogoutModal: false })
    }

    menuMobile = () => {
        if (window.innerWidth < 1025) {
            this.setState({ isMobile: true, showMenu: false })
        } else {
            this.setState({ isMobile: false, showMenu: true })
        }
    }

    toggleMenu = () => {
        if (this.state.isMobile) this.setState({ showMenu: !this.state.showMenu })
    }

    toggleDropdownAndMenu = () => {
        this.toggleDropdown()
        this.toggleMenu()
    }

    render() {

        if (this.state.showMenu && this.state.isMobile) document.body.style.overflowY = 'hidden';
        else document.body.style.overflowY = 'auto';

        return (
            <>
                {this.state.redirect ? <Redirect to="/" /> : null}
                <Modal title="Atenção!" message="Tem certeza que deseja sair?" visible={this.state.showLogoutModal} type="yesno" handleYes={this.logout.bind(this)} hide={this.hideModal.bind(this)} />
                <header id="main-header">
                    <div className="header-content">
                        {
                            this.state.isMobile ?
                                <span id="bars" onClick={this.toggleMenu}>
                                    <FontAwesomeIcon icon={faBars} />
                                </span>
                                :
                                null
                        }
                        <div className="logo-content">
                            <span>Gerenciamento LoremIpsum</span>
                        </div>
                    </div>
                </header>
                {this.state.showMenu ?
                    <div id="side-menu">
                        <div id="logo-box">
                            <img alt="logo" src={logo} />
                            <div id="user-info" ref={this.setWrapperRef}>
                                <span>
                                    {this.state.user ? this.state.user.name : null}<br />
                                    {this.state.user ? this.state.user.email : null}
                                </span>
                                <button onClick={this.toggleDropdown}>
                                    <FontAwesomeIcon style={{ marginRight: 5 }} icon={faChevronDown} />
                                </button>
                                {this.state.showDropdown ?
                                    <div id="dropdown-login">
                                        <ul>
                                            <NavLink exact to={`/superUsers/edit-password?superUserId=${this.state.user ? this.state.user._id : ""}`} onClick={this.toggleDropdownAndMenu}>
                                                <FontAwesomeIcon style={{ marginRight: 5 }} icon={faLock} />
                                                <span>Alterar senha</span>
                                            </NavLink>
                                            <button onClick={this.openLogoutModal}>
                                                <FontAwesomeIcon style={{ marginRight: 5 }} icon={faSignOutAlt} />
                                                <span>Sair</span>
                                            </button>
                                        </ul>
                                    </div>
                                    : null
                                }
                            </div>
                        </div>
                        <div id="menu">
                            <header>
                                Menu
                                </header>
                            <nav>
                                <ul id="main-ul">
                                    <li className="itemWrapper">
                                        <NavLink exact to="/home" isActive={(match, location) => {
                                            const regex = new RegExp(/home/)
                                            return regex.test(location.pathname)
                                        }} onClick={this.toggleMenu} className="menu-item" activeClassName="active-menu">
                                            <img alt="Home" src={home} />
                                            <span>Home</span>
                                        </NavLink>
                                    </li>
                                    <li className="itemWrapper">
                                        <NavLink exact to="/users" isActive={(match, location) => {
                                            const regex = new RegExp(/users/)
                                            return regex.test(location.pathname)
                                        }} onClick={this.toggleMenu} className="menu-item" activeClassName="active-menu">
                                            <img alt="User" src={user} />
                                            <span>Usuários</span>
                                        </NavLink>
                                    </li>
                                    <li className="itemWrapper">
                                        <NavLink exact to="/faqs" isActive={(match, location) => {
                                            const regex = new RegExp(/faqs/)
                                            return regex.test(location.pathname)
                                        }} onClick={this.toggleMenu} className="menu-item" activeClassName="active-menu">
                                            <img alt="Faq" src={faq} />
                                            <span>FAQ</span>
                                        </NavLink>
                                    </li>
                                    <li className="itemWrapper">
                                        <NavLink exact to="/superUsers" isActive={(match, location) => {
                                            const regex = new RegExp(/superUsers/)
                                            return regex.test(location.pathname)
                                        }} onClick={this.toggleMenu} className="menu-item" activeClassName="active-menu">
                                            <img alt="SuperUsers" src={superUser} />
                                            <span>Super Usuários</span>
                                        </NavLink>
                                    </li>
                                </ul>
                            </nav >
                        </div >
                    </div>
                    : null}
            </>
        );
    }
}

export default SideHeader;
