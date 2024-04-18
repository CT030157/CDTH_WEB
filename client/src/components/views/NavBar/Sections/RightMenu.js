/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import { Menu, Badge } from 'antd';
import {ShoppingCartOutlined, LogoutOutlined , ShopOutlined , HistoryOutlined} from '@ant-design/icons';
import axios from 'axios';
import { USER_SERVER } from '../../../Config';
import { withRouter } from 'react-router-dom';
import { useSelector } from "react-redux";

function RightMenu(props) {
  const user = useSelector(state => state.user)

  const logoutHandler = () => {
    axios.get(`${USER_SERVER}/logout`).then(response => {
      if (response.status === 200) {
        props.history.push("/login");
      } else {
        alert('Lỗi đăng xuất')
      }
    });
  };

  if (user.userData && !user.userData.isAuth) {
    return (
      <Menu mode={props.mode}>
        <Menu.Item key="mail">
          <a href="/login">Đăng nhập</a>
        </Menu.Item>
        <Menu.Item key="app">
          <a href="/register">Đăng kí</a>
        </Menu.Item>
      </Menu>
    )
  } else {
    return (
      <Menu mode={props.mode}>

        <Menu.Item key="history">
          <a href="/history">
            <HistoryOutlined style={{color:'#3e91f7', fontSize: '29px', marginTop: '9px'}} />
          </a>
        </Menu.Item>

        <Menu.Item key="shop">
          <a href="/shop">
            <ShopOutlined style={{color:'#3e91f7', fontSize: '30px', marginTop: '9px'}} />
          </a>
        </Menu.Item>

        <Menu.Item key="cart" style={{ paddingBottom: 3 }}>
          <Badge count={user.userData && user.userData.cart.length}>
            <a href="/user/cart">
              <ShoppingCartOutlined style={{color:'#3e91f7', fontSize: '32px', marginTop: '7px'}} />
            </a>
          </Badge>
        </Menu.Item>


        <Menu.Item key="logout">
          <a onClick={logoutHandler}>
            <LogoutOutlined style={{color:'#3e91f7', fontSize: '27px', marginTop: '10px'}} />
          </a>
        </Menu.Item>
      </Menu>
    )
  }
}

export default withRouter(RightMenu);

