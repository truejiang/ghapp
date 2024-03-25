import { outLogin } from '@/services/ant-design-pro/login';
import { getSessionId, getToken, removeSessionId, removeToken } from '@/utils/indexs';
import { EditOutlined, LogoutOutlined, UserOutlined } from '@ant-design/icons';
import { useEmotionCss } from '@ant-design/use-emotion-css';
import { history, useModel } from '@umijs/max';
import { Spin, message } from 'antd';
import { stringify } from 'querystring';
import type { MenuInfo } from 'rc-menu/lib/interface';
import React, { useCallback, useState } from 'react';
import { flushSync } from 'react-dom';
import HeaderDropdown from '../HeaderDropdown';
import { ModalForm, ProFormText } from '@ant-design/pro-components';
import { resetPassword } from '@/services/ant-design-pro/user';

export type GlobalHeaderRightProps = {
  menu?: boolean;
  children?: React.ReactNode;
};

export const AvatarName = () => {
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};
  return <span className="anticon">{currentUser?.username}</span>;
};

export const AvatarDropdown: React.FC<GlobalHeaderRightProps> = ({ menu, children }) => {
  const { initialState, setInitialState } = useModel('@@initialState');
  const [modalOpen, setModalOpen] = useState(false);
  /**
   * 退出登录，并且将当前的 url 保存
   */
  const loginOut = async () => {
    await outLogin(getSessionId() || '');
    // 清空用户信息
    flushSync(() => {
      setInitialState((s) => ({ ...s, currentUser: undefined }));
    });
    // 移除token
    removeToken();
    removeSessionId();
    const { search, pathname } = window.location;
    const urlParams = new URL(window.location.href).searchParams;
    /** 此方法会跳转到 redirect 参数所在的位置 */
    const redirect = urlParams.get('redirect');
    // Note: There may be security issues, please note
    if (window.location.pathname !== '/login' && !redirect) {
      history.replace({
        pathname: '/login',
        search: stringify({
          redirect: pathname + search,
        }),
      });
    }
  };
  const actionClassName = useEmotionCss(({ token }) => {
    return {
      display: 'flex',
      height: '48px',
      marginLeft: 'auto',
      overflow: 'hidden',
      alignItems: 'center',
      padding: '0 8px',
      cursor: 'pointer',
      borderRadius: token.borderRadius,
      '&:hover': {
        backgroundColor: token.colorBgTextHover,
      },
    };
  });

  const onMenuClick = useCallback(
    (event: MenuInfo) => {
      const { key } = event;
      if (key === 'logout') {
        loginOut();
        return;
      } else if (key === 'ResetPassword') {
        setModalOpen(true);
        return;
      }
      history.push(`/account/${key}`);
    },
    [setInitialState],
  );

  const loading = (
    <span className={actionClassName}>
      <Spin
        size="small"
        style={{
          marginLeft: 8,
          marginRight: 8,
        }}
      />
    </span>
  );

  if (!initialState) {
    return loading;
  }

  const { currentUser } = initialState;

  if (!currentUser || !currentUser.username) {
    return loading;
  }

  const menuItems = [
    ...(menu
      ? [
          {
            key: 'center',
            icon: <UserOutlined />,
            label: '个人中心',
          },
          {
            type: 'divider' as const,
          },
        ]
      : []),
    {
      key: 'ResetPassword',
      icon: <EditOutlined />,
      label: '修改密码',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '退出登录',
    },
  ];

  return (
    <>
      <HeaderDropdown
        menu={{
          selectedKeys: [],
          onClick: onMenuClick,
          items: menuItems,
        }}
      >
        {children}
      </HeaderDropdown>
      <ModalForm
          title="修改密码"
          width="400px"
          open={modalOpen}
          onFinish={async (fields: API.ResetPassword) => {
            const hide = message.loading('正在添加');
            try {
              await resetPassword({...fields, token: getToken() || ''});
              hide();
              message.success('修改成功！');
              setModalOpen(false);
              return true;
            } catch (error) {
              hide();
              message.error('修改失败');
              return false;
            }
          }}
          modalProps={{
            onCancel() {
              setModalOpen(false)
            }
          }}
        >
          <ProFormText
            rules={[
              {
                required: true,
                message: '密码必须输入',
              },
            ]}
            width="md"
            name="password"
            label="新密码"
          />
        </ModalForm>
    </>
  );
};
