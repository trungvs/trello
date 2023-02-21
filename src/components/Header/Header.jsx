import React from "react";
import { MenuOutlined } from "@ant-design/icons"
import { Button, Space, Tooltip } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

export default function Header() {

    return (
        <>
        <Button type="primary" size="large" icon={<MenuOutlined />} />
        </>
    )
}