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
import {
  AppstoreOutlined,
  ContainerOutlined,
  DesktopOutlined,
  MailOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  PieChartOutlined,
} from '@ant-design/icons';

const routes = createBrowserRouter([
  {
    path: "/smart-safety-area",
    key: "/smart-safety-area",
    label:'智安小区后台配置',
    icon:<PieChartOutlined></PieChartOutlined>,
    element: '',
    children: [
      {
        path: "create",
        key: "create",
        label:'小区创建',
        element: <CreateArea />,
      },
      {
        path: "address-link",
        key: "address-link",
        label:'地址关联',
        element: <AddressLink />,
      },
      {
        path: "device-link",
        key: "device-link",
        label:'设备关联',
        element: <DeviceLink />,
      },
      {
        path: "threshold-config",
        key: "threshold-config",
        label:'阈值设置',
        element: <ThresholdConfig />,
      },
    ],
  },
  {
    path:'/source-manage',
    label:'资源管理',
    icon:<DesktopOutlined ></DesktopOutlined >,
    element:'',
    children:[
      {
        path:'control-element',
        key:'control-element',
        label:'静态要素上图',
        element:<ControlElement></ControlElement>
      }
    ]
  },
  {
    path:'/user-management',
    label:'用户管理',
    icon:<ContainerOutlined  ></ContainerOutlined  >,
    element:'',
    children:[
      {
        path:'department',
        key:'department',
        label:'部门管理',
        element:<DepartmentManage></DepartmentManage>,
      },
      {
        path:'role',
        key:'role',
        label:'角色管理',
        element:<RoleManage></RoleManage>,
      },
      {
        path:'user',
        key:'user',
        label:'用户管理',
        element:<UserManage></UserManage>,
      },
    ]
  }
]);

export default routes