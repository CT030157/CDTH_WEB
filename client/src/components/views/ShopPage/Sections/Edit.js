import React, { useState , useEffect} from 'react'
import { Typography, Button, Form, Input } from 'antd';
import FileUpload from './FileUpload'
import Axios from 'axios';

const { Title } = Typography;
const { TextArea } = Input;

const Categories = [
    { key: 1, value: "Thời trang" },
    { key: 2, value: "Phụ kiện" },
    { key: 3, value: "Điện thoại" },
    { key: 4, value: "Máy tính & Laptop" },
    { key: 5, value: "Linh kiện điện tử" },
    { key: 6, value: "Thiết bị gia dụng" },
    { key: 7, value: "Sách báo" }
]

function Edit(props) {
    const images = [
        props.detail.images];
    const [TitleValue, setTitleValue] = useState(props.detail.title)
    const [DescriptionValue, setDescriptionValue] = useState(props.detail.description)
    const [PriceValue, setPriceValue] = useState(props.detail.price)
    const [CategoryValue, setCategoryValue] = useState(props.detail.category)
    const [Images, setImages] = useState(images)


    const onTitleChange = (event) => {
        setTitleValue(event.currentTarget.value)
    }

    const onDescriptionChange = (event) => {
        setDescriptionValue(event.currentTarget.value)
    }

    const onPriceChange = (event) => {
        setPriceValue(event.currentTarget.value)
    }

    const onCategoriesSelectChange = (event) => {
        setCategoryValue(event.currentTarget.value)
    }

    const updateImages = (newImages) => {
        setImages(newImages)
    }
    const onSubmit = (event) => {
        event.preventDefault();


        if (!TitleValue || !DescriptionValue || !PriceValue ||
            !CategoryValue || !Images) {
            return alert('fill all the fields first!')
        }

        const variables = {
            _id : props.detail._id,
            writer: localStorage.userId,
            title: TitleValue,
            description: DescriptionValue,
            price: PriceValue,
            images: Images,
            category: CategoryValue,
        }

        Axios.post('/api/product/edit', variables)
            .then(response => {
                if (response.data.success) {
                    alert('Sửa hàng thành công')
                    window.location.reload();
                } else {
                    alert('Sửa hàng thất bại')
                }
            })

    }
    return (
        <div style={{ maxWidth: '700px', margin: '2rem auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <Title level={2}> Cập nhập sản phẩm</Title>
            </div>


            <Form onSubmit={onSubmit} >

                <FileUpload refreshFunction={updateImages} images = {props.detail.images} />

                <br />
                <br />
                <label>Tên mặt hàng</label>
                <Input
                    onChange={onTitleChange}
                    value={TitleValue}
                />
                <br />
                <br />
                <label>Mô tả</label>
                <TextArea
                    onChange={onDescriptionChange}
                    value={DescriptionValue}
                />
                <br />
                <br />
                <label>Giá tiền(.000 VNĐ)</label>
                <Input
                    onChange={onPriceChange}
                    value={PriceValue}
                    type="number"
                />
                <br /><br />
                <select onChange={onCategoriesSelectChange} value={CategoryValue}>
                    {Categories.map(item => (
                        <option key={item.key} value={item.key}>{item.value} </option>
                    ))}
                </select>
                <br />
                <br />

                <Button
                    onClick={onSubmit}
                >
                    Cập nhập
                </Button>

            </Form>

        </div>
    )
}

export default Edit