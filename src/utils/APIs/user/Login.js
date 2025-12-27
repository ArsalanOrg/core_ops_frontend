import { Request } from 'utils/APIs/APICenter'

export const LoginAPI = async (username, password, setUserName) => {
  const apiUrl = 'user/login'

  const data = {
    userName: username,
    password: password,
  }
  const res = await Request('POST', apiUrl, data, false)
  if (res.fail) return false
  else {
    const name = res.response.user.UserName
    const fullName = res.response.user.FullName
    const department = res.response.user.Department
    console.log(res.response.user)

    const department_role = res.response.user.DepartmentRole
    // const department_head = res.response.userData.departmentHead
    const role = res.response.user.Role
    const jwt = res.response.token
    console.log(res)

    const ID = res.response.user.ID
    // const userDepartment = res.response.userData.userDepartment
    // const departmentHeadID = res.response.userData.departmentHeadID

    setUserName(name)
    localStorage.setItem('UserID', ID)
    localStorage.setItem('jwt', jwt)
    localStorage.setItem('username', name)
    localStorage.setItem('fullName', fullName)
    // localStorage.setItem('departmentHead', department_head)
    localStorage.setItem('userDepartment', department)
    // localStorage.setItem('departmentHeadID', departmentHeadID)

    if (department === 1) localStorage.setItem('role', 'admin')
    else if (department_role === 1) localStorage.setItem('role', 'user')
    else if (department_role === 2) localStorage.setItem('role', 'head')

    return true
  }
}
