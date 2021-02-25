import { Switch, Route, Redirect } from "react-router-dom";
import React, { Fragment } from "react";

import SideHeader from "./components/SideHeader";

import Home from "./components/Home";

import Login from "./components/Login";
import EditPassword from "./components/EditPassword";
import ResetPassowrd from "./components/ResetPassword";

import User from "./components/User";
import UserCreate from "./components/UserCreate";
import UserUpdate from "./components/UserUpdate";
import UserDetails from "./components/UserDetails";

import Faq from "./components/Faq";
import FaqCreate from "./components/FaqCreate";
import FaqUpdate from "./components/FaqUpdate";
import FaqDetails from "./components/FaqDetails";

import SuperUser from "./components/SuperUser";
import SuperUserCreate from "./components/SuperUserCreate";
import SuperUserUpdate from "./components/SuperUserUpdate";

function Routes() {
    return (
        <Switch>
            <Route path="/" exact component={Login} />
            <Route path="/resetPassword" exact component={ResetPassowrd} />
            <Fragment>
                <SideHeader />
                <Switch>
                    <Route path="/superUsers/edit-password" exact component={EditPassword} />

                    <Route path="/home" exact component={Home} />

                    <Route path="/faqs" exact component={Faq} />
                    <Route path="/faqs/create" exact component={FaqCreate} />
                    <Route path="/faqs/update/:faqId" exact component={FaqUpdate} />
                    <Route path="/faqs/details/:faqId" exact component={FaqDetails} />

                    <Route path="/users" exact component={User} />
                    <Route path="/users/create" exact component={UserCreate} />
                    <Route path="/users/update/:userId" exact component={UserUpdate} />
                    <Route path="/users/details/:userId" exact component={UserDetails} />

                    <Route path="/superUsers" exact component={SuperUser} />
                    <Route path="/superUsers/create" exact component={SuperUserCreate} />
                    <Route path="/superUsers/update/:superUserId" exact component={SuperUserUpdate} />
                    <Redirect to="/" />
                </Switch>
            </Fragment>

        </Switch>
    );
}

export default Routes;
