import { Menu } from 'antd';
import { LayoutDashboard, Users, Global, ShoppingCart, CreditCard, FileText } from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import config from './config';

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = config.children.map((item) => {
    const Icon = getIcon(item.icon);
    return {
      key: item.path,
      icon: <Icon />,
      label: item.title,
    };
  });

  const getIcon = (iconName: string) => {
    const iconMap: Record<string, any> = {
      LayoutDashboard,
      Users,
      Global,
      ShoppingCart,
      CreditCard,
      FileText,
    };
    return iconMap[iconName] || null;
  };

  return (
    <Menu
      theme="dark"
      mode="inline"
      selectedKeys={[location.pathname]}
      items={menuItems}
      onClick={({ key }) => navigate(key)}
    />
  );
}