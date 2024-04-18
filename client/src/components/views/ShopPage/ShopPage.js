import React, { useEffect, useState } from 'react'
import Axios from 'axios'
import { useDispatch } from 'react-redux';
import ImageSlider from '../../utils/ImageSlider';
import Modal from 'react-modal';
import {  Col, Card , Row, Button } from 'antd';
import {  EditOutlined , DeleteOutlined } from '@ant-design/icons';
import { Menu } from 'antd';
import Edit from './Sections/Edit';

const { Meta } = Card;

function ShopPage(props){

    const [modalIsOpen,setModalIsOpen] = useState(false);

    const setModalIsOpenToFalse =()=>{
        setModalIsOpen(false)
    }

    const [Products, setProducts] = useState([])
    const [Skip, setSkip] = useState(0)
    const [Limit, setLimit] = useState(20)
    const [PostSize, setPostSize] = useState()
    const [Detail, setDeTail] = useState([])


    const getProducts = (variables) => {
        Axios.post('/api/product/getWriter', variables)
            .then(response => {
                if (response.data.success) {
                    if (variables.loadMore) {
                        setProducts([...Products, ...response.data.products])
                    } else {
                        setProducts(response.data.products)
                    }
                    setPostSize(response.data.postSize)
                } else {
                    alert('Failed to fectch product datas')
                }
            })
    }


    useEffect(() => {
        const variables = {
            searchWrite : localStorage.userId,
            skip: Skip,
            limit: Limit,
        }
        getProducts(variables)
    }, [])

    const renderCards = Products.map((product, index) => {

        const onDelete = (event) => {
            event.preventDefault();
    
            const variables = {
                _id : product._id,
            }
    
            Axios.post('/api/product/delete', variables)
                .then(response => {
                    if (response.data.success) {
                        alert('Xóa hàng thành công')
                        window.location.reload();
                    } else {
                        alert('Xóa hàng thất bại')
                    }
                })
        }


        const setModalIsOpenToTrue = ()=>{
            setModalIsOpen(true)
            const variables = {
                        _id : product._id,
                        writer: product.writer,
                        title: product.title,
                        description: product.description,
                        price: product.price,
                        images: product.images,
                        category: product.category,
                    }
            setDeTail(variables)
        }
        return <Col lg={6} md={8} xs={24}>
            <Card
                hoverable={true}
                cover={<a href={`/product/${product._id}`}> <ImageSlider images={product.images} /></a>}
                actions={[
                    <button onClick={setModalIsOpenToTrue} ><EditOutlined /></button>, 
                    <Modal isOpen={modalIsOpen} >
                        <button onClick={setModalIsOpenToFalse}>x</button>
                        <Edit detail={Detail} />
                    </Modal>,
                    <button onClick={onDelete}><DeleteOutlined/></button>
                ]
                } 
                key ={product._id}
            >
                <Meta
                    title={product.title}
                    description={`${product.price}.000VND`}
                />
            </Card>
        </Col>
    })

    return(
        <div style={{ width: '75%', margin: '3rem auto',marginTop:'0px' }}>
              
            <div style={{ textAlign: 'center' , paddingTop : '20px' }}>
                <h1> Cửa hàng </h1>
            </div>

            <div style={{ paddingBottom : '20px' }}>
                <Menu mode="horizontal" style={{width: '100%'}} >
                    <Menu.Item key="upload" style={{width: '50%' , color:'#3e91f7', fontSize: '25px' , textAlign : 'center' }} >
                        <a href="/product/upload">Đăng sản phẩm</a>
                    </Menu.Item>
                    <Menu.Item key="uh" style={{width: '50%' , color:'#3e91f7', fontSize: '25px' , textAlign: 'center'}}>
                        <a href="/sold">Lịch sử bán</a>
                    </Menu.Item> 
                </Menu>
            </div>
            {Products.length === 0 ?
                <div style={{ display: 'flex', height: '300px', justifyContent: 'center', alignItems: 'center' }}>
                    <h2>Chưa có hàng</h2>
                </div> :
                <div>
                    <Row gutter={[16, 16]}>

                        {renderCards}

                    </Row>


                </div>
            }
            <br /><br />



        </div>
    );
}
export default ShopPage