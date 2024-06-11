import React, { useState } from 'react'
import { Checkbox, Collapse } from 'antd';

const { Panel } = Collapse

const categories = [
    { key: 1, value: "Áo Nam", gender: 1, group: 1 },
    { key: 2, value: "Quần Nam", gender: 1, group: 2 },
    { key: 3, value: "Áo Nữ", gender: 2, group: 1 },
    { key: 4, value: "Quần Nữ", gender: 2, group: 2 },
    { key: 5, value: "Phụ Kiện", gender: 3, group: 1 },
]

function CheckBox(props) {

    const [Checked, setChecked] = useState([])

    const handleToggle = (value) => {

        const currentIndex = Checked.indexOf(value);
        const newChecked = [...Checked];

        if (currentIndex === -1) {
            newChecked.push(value)
        } else {
            newChecked.splice(currentIndex, 1)
        }

        setChecked(newChecked)
        props.handleFilters(newChecked)

    }

    const renderCheckboxLists = (gender, group) => props.list && props.list.filter(item => item.gender == gender && item.group == group).map((value, index) => (
        <div key={index} style={{ display: 'block' }}>
            <React.Fragment key={index}>
                <Checkbox
                    onChange={() => handleToggle(value._id)}
                    type="checkbox"
                    checked={Checked.indexOf(value._id) === -1 ? false : true}
                />&nbsp;&nbsp;
                <span>{value.name}</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            </React.Fragment>
        </div>
    ))

    const renderCategories = () => categories.map(({key, value, gender, group}) =>(
        // <div style={{ display: 'inline-block', marginRight: '10px' }}>
            <Collapse defaultActiveKey={['0']} >
                <Panel header={value} key={key}  >
                    {renderCheckboxLists(gender, group)}
                </Panel>
            </Collapse>
        // </div>
    ))

    return (
        <div>
            <Collapse defaultActiveKey={['0']} >
                <Panel header="Danh mục" key="1">
                    {renderCategories()}
                </Panel>
            </Collapse>
        </div>
    )
}

export default CheckBox
