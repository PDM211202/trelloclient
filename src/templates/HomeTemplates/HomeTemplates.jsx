import React, { Fragment } from 'react'
import { Route } from 'react-router-dom';
import Header from '../../layouts/Header/Header'
import Footer from '../../layouts/Footer/Footer'

export default function HomeTemplates(props) {
    const { Component, ...restProps } = props;

    return (
        <Route {...restProps} render={(propsRoute) => {
            return <Fragment>
                <Header {...restProps} />
                <Component {...propsRoute} />
                <Footer />
            </Fragment>
        }} />
    )
}
