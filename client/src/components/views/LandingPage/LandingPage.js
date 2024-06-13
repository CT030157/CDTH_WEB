import React, { useEffect, useState } from 'react'
import Axios from 'axios';
import {  Col, Card, Row } from 'antd';
import  Icon  from '@ant-design/icons';
import ImageSlider from '../../utils/ImageSlider';
import CheckBox from './Sections/CheckBox';
import RadioBox from './Sections/RadioBox';
import { category , price } from '../../utils/Datas';
import SearchFeature from './Sections/SearchFeature';
import { PRODUCT_SERVER } from '../../Config';

const { Meta } = Card;

function LandingPage() {

    const [Products, setProducts] = useState([])
    const [Skip, setSkip] = useState(0)
    const [Limit, setLimit] = useState(12)
    const [PostSize, setPostSize] = useState()
    const [SearchTerms, setSearchTerms] = useState("")

    const [Filters, setFilters] = useState({
        category: [],
        price: []
    })

    useEffect(() => {

        const variables = {
            skip: Skip,
            limit: Limit,
            writer: localStorage.userId ? localStorage.userId : ''
        }

        getProducts(variables)

    }, [])

    const getProducts = (variables) => {
        Axios.post(`${PRODUCT_SERVER}/getProducts`, variables)
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

    const onLoadMore = () => {
        let skip = Skip + Limit;

        const variables = {
            skip: skip,
            limit: Limit,
            loadMore: true,
            filters: Filters,
            writer: localStorage.userId ? localStorage.userId : ''
        }
        getProducts(variables)
        setSkip(skip)
    }

    const addDotToNumber = (num) => {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }


    const renderCards = Products.map((product, index) => {

        return <Col lg={6} md={8} >
            <Card
                key={index}
                hoverable={true}
                cover={<a href={`/product/${product._id}`} > <ImageSlider images={product.images} /></a>}
            >
                <Meta
                    key={index}
                    title={product.title}
                    description={`${addDotToNumber(product.price ?? 0)}VND`}
                />
            </Card>
        </Col>
    })


    const showFilteredResults = (filters) => {

        const variables = {
            skip: 0,
            limit: Limit,
            filters: filters,
            writer: localStorage.userId ? localStorage.userId : ''
        }
        getProducts(variables)
        setSkip(0)

    }

    const handlePrice = (value) => {
        const data = price;
        let array = [];

        for (let key in data) {

            if (data[key]._id === parseInt(value, 10)) {
                array = data[key].array;
            }
        }
        return array
    }

    const handleFilters = (filters, Category) => {

        const newFilters = { ...Filters }

        newFilters[Category] = filters

        if (Category === "price") {
            let pricesValues = handlePrice(filters)
            newFilters[Category] = pricesValues

        }


        showFilteredResults(newFilters)
        setFilters(newFilters)
    }

    const updateSearchTerms = (newSearchTerm) => {

        const variables = {
            skip: 0,
            limit: Limit,
            filters: Filters,
            searchTerm: newSearchTerm,
            writer: localStorage.userId ? localStorage.userId : ''
        }

        setSkip(0)
        setSearchTerms(newSearchTerm)

        getProducts(variables)
    }


    return (
        <div style={{ width: '75%', margin: '3rem auto',marginTop:'0px' }}>
            
            <div style={{position: 'fixed' , zIndex:'2' , width: '75%', background: '#ffffff'}}>
                <div style={{ margin: '1rem auto'  }}>

                    <SearchFeature
                        refreshFunction={updateSearchTerms}
                    />

                </div>


                <Row gutter={[16, 16]} style={{paddingBottom:'20px'}} >
                    <Col lg={12} xs={10} >
                        <CheckBox
                            list={category}
                            handleFilters={filters => handleFilters(filters, "category")}
                        />
                    </Col>
                    <Col lg={12} xs={10}>
                        <RadioBox
                            list={price}
                            handleFilters={filters => handleFilters(filters, "price")}
                        />
                    </Col>
                </Row>
            </div>    

            <div style={{ textAlign: 'center', paddingTop:'130px' }}>
                <h2>  Chúc bạn mua sắm vui vẻ  <Icon type="rocket" />  </h2>
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

            {PostSize >= Limit &&
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <button onClick={onLoadMore}>Tải thêm</button>
                </div>
            }


        </div>
    )
}

export default LandingPage
