import React, { useState } from 'react'
import { Typography, Button, Form, Input } from 'antd';
import FileUpload from '../../utils/FileUpload'
import Axios from 'axios';
import { PRODUCT_SERVER } from '../../Config';
import { category } from '../../utils/Datas';
import { Collapse, Radio } from 'antd';

const { Panel } = Collapse;
const { Title } = Typography;
const { TextArea } = Input;

const categories = [
    { key: 1, value: "Áo Nam", gender: 1, group: 1 },
    { key: 2, value: "Quần Nam", gender: 1, group: 2 },
    { key: 3, value: "Áo Nữ", gender: 2, group: 1 },
    { key: 4, value: "Quần Nữ", gender: 2, group: 2 },
    { key: 5, value: "Phụ Kiện", gender: 3, group: 1 },
]
 
function UploadProductPage(props) {

    const [TitleValue, setTitleValue] = useState("")
    const [DescriptionValue, setDescriptionValue] = useState("")
    const [PriceValue, setPriceValue] = useState(0)
    const [CategoryValue, setCategoryValue] = useState(1)

    const [Images, setImages] = useState([])


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
        setCategoryValue(event.target.value)
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
            writer: props.user.userData._id,
            title: TitleValue,
            description: DescriptionValue,
            price: PriceValue,
            images: Images,
            category: CategoryValue,
        }

        Axios.post(`${PRODUCT_SERVER}/uploadProduct`, variables)
            .then(response => {
                if (response.data.success) {
                    alert('Nhập hàng thành công')
                    props.history.push('/shop')
                } else {
                    alert('Nhập hàng thất bại')
                }
            })

    }

    const renderOptionLists = (gender, group) => category.filter(item => item.gender == gender && item.group == group).map((item, index) => (
        <Radio key={item._id} value={`${item._id}`}>{item.name}</Radio>
    ))

    const renderCategories = () => categories.map(({key, value, gender, group}) =>(
            <Collapse defaultActiveKey={['0']} key={key}>
                <Panel header={value} key={key}  >
                    {renderOptionLists(gender, group)}
                </Panel>
            </Collapse>
    ))

    return (
        <div style={{ maxWidth: '700px', margin: '2rem auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <Title level={2}> Đăng tải sản phẩm</Title>
            </div>


            <Form onSubmit={onSubmit} >

                <FileUpload refreshFunction={updateImages} />

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
                <label>Giá tiền(nghìn VNĐ)</label>
                <Input
                    onChange={onPriceChange}
                    value={PriceValue}
                    type="number"
                />
                <br /><br />

                <label>Phân loại</label>
                <Collapse defaultActiveKey={['0']}>
                    <Panel header={category.find(item => item._id == CategoryValue).name} key="1">
                        <Radio.Group onChange={onCategoriesSelectChange} value={CategoryValue}>

                            {renderCategories()}

                        </Radio.Group>
                    </Panel>
                </Collapse>
                <br />
                <br />

                <Button
                    onClick={onSubmit}
                >
                    Nhập
                </Button>

            </Form>

        </div>
    )
}

export default UploadProductPage
