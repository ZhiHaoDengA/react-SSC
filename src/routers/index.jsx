import {createBrowserRouter} from 'react-router-dom'
import Home from '@/pages/Home';
import NotFound from '@/pages/NotFound';
import AddressLink from '@/pages/AddressLink';
import ControlElement from '@/pages/ControlElement';
import CreateArea from '@/pages/CreateArea';
import DepartmentManage from '@/pages/DepartmentManage';
import DeviceLink from '@/pages/DeviceLink';
import RoleManage from '@/pages/ThresholdConfig';
import ThresholdConfig from "@/pages/ThresholdConfig"
import UserManage from '@/pages/UserManage';


const routes = createBrowserRouter([
  {
    path: "/smart-saft-area",
    name:'智安小区后台配置',
    element: '',
    children: [
      {
        path: "create",
        name:'小区创建',
        element: <CreateArea />,
      },
      {
        path: "address",
        name:'地址关联',
        element: <AddressLink />,
      },
      {
        path: "address",
        name:'设备关联',
        element: <DeviceLink />,
      },
      {
        path: "address",
        name:'阈值设置',
        element: <ThresholdConfig />,
      },
    ],
  },
  {
    path:'',
    name:'资源管理',
    element:'',
    children:[
      {
        path:'/contral-element',
        name:'静态要素上图',
        element:<ControlElement></ControlElement>
      }
    ]
  },
  {
    path:'/user-management',
    name:'用户管理',
    element:'',
    children:[
      {
        path:'department',
        name:'部门管理',
        element:<DepartmentManage></DepartmentManage>,
      },
      {
        path:'role',
        name:'角色管理',
        element:<RoleManage></RoleManage>,
      },
      {
        path:'user',
        name:'用户管理',
        element:<UserManage></UserManage>,
      },
    ]
  }
]);

export default routes