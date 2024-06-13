import React,{ useState , useEffect} from 'react'
import Axios from 'axios';
import { Button } from 'antd';
import { KeyOutlined, CloseOutlined, LockOutlined, UnlockOutlined} from '@ant-design/icons';
import { USER_SERVER } from '../../Config';
function AdminUserPage(props) {
    const [Users, setUsers] = useState([])


    const getUsers = () => {
        Axios.get(`${USER_SERVER}/admin/users`)
            .then(response => {
                if (response.data) {
                    setUsers(response.data.users)
                } else {
                    alert('Lỗi lấy dữ liệu')
                }
            })
    }

    const changePasswordUser = (id) => {
        Axios.post(`${USER_SERVER}/admin/users/changePassword`, {id: id, newPassword: '123456'})
            .then(response => {
                if (response.data.success) {
                    alert('Thành công')
                } else {
                    alert(response.data.message)
                }
            })
    }

    const blockUser = (id, status) => {
        Axios.post(`${USER_SERVER}/admin/users/block`, {id: id, status: status})
            .then(response => {
                if (response.data.success) {
                    alert('Thành công');
                    getUsers();
                } else {
                    alert(response.data.message)
                }
            })
    }

    const deleteUser = (id) => {
        Axios.post(`${USER_SERVER}/admin/users/delete`, {id: id})
            .then(response => {
                if (response.data.success) {
                    alert('Thành công');
                    getUsers();
                } else {
                    alert(response.data.message)
                }
            })
    }

    useEffect(() => {
        getUsers()
    }, [])

    
    const renderCards = Users.map((user, index) => {
        return(
            <tr key={user._id}>
                <td>{index+1}</td> 
                <td>{user._id}</td> 
                <td>
                    <img style={{ width: '70px' }} alt="avatar" 
                    src={user.image} />
                    <div style={{display: 'inline-block', marginLeft: '10px'}} >{user.name}</div>
                </td> 
                <td>{user.email}</td>
                <td>
                    <div style={{ display: 'inline-block', marginRight: '10px' }}>
                        {user.status == 1
                        ?
                        <Button size="large" shape="default" style={{backgroundColor: 'black', color: 'white'}}
                            onClick={() => {blockUser(user._id, 0)}}
                        >
                            <LockOutlined style={{color:'#ffffff', fontSize: '20px', paddingTop: '5px', paddingBottom: '5px'}} />
                        </Button>
                        :
                        <Button size="large" shape="default" style={{backgroundColor: 'black', color: 'white'}}
                            onClick={() => {blockUser(user._id, 1)}}
                        >
                            <UnlockOutlined style={{color:'#ffffff', fontSize: '20px', paddingTop: '5px', paddingBottom: '5px'}} />
                        </Button>
                        }
                    </div>

                    <div style={{ display: 'inline-block', marginRight: '10px' }}>
                        <Button size="large" shape="default" style={{backgroundColor: 'red', color: 'white'}}
                            onClick={() => deleteUser(user._id)}
                        >
                            <CloseOutlined style={{color:'#ffffff', fontSize: '20px', paddingTop: '5px', paddingBottom: '5px'}} />
                        </Button>
                    </div>
                </td>
            </tr>   
        )
    })


    return (
        <div style={{width: '75%' , margin: '3rem auto'}}>
            <div style={{ textAlign: 'center' , padding : '20px' }}>
                <h1> Danh sách người dùng</h1>
            </div>
            <table>
                <thead>
                    <tr>
                        <th>STT</th>
                        <th>Mã người dùng</th>
                        <th>Tên</th>
                        <th>Email</th>
                        <th>Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {renderCards}
                </tbody>
            </table>
        </div>
    )
}

export default AdminUserPage