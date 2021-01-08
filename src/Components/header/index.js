import React, { useState } from "react";
import { Container, Header, Left, Body, Right, Button, Icon, Title } from 'native-base';
import PropTypes from 'prop-types'

const PDHeader = ({ name, backHandler, menu }, props) => {
    return (
        <Header>
            <Left >
                {backHandler !== null && <Button transparent onPress={backHandler}>
                    <Icon name='arrow-back' />
                </Button>}
            </Left>
            <Body style={{ position: "absolute" }}>
                <Title>{name}</Title>
            </Body>
            <Right>
                {/* <Button transparent>
                    <Icon name='menu' />
                </Button> */}
            </Right>
        </Header>
    )
}

export default PDHeader;



