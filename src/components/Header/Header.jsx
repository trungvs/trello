import React from "react";
import { ReloadOutlined } from "@ant-design/icons"
import { Button, Space, Tooltip } from 'antd';

export default function Header() {

    return (
        <>
        <Button type="primary" size="large" icon={<ReloadOutlined />} onClick={() => window.location.reload()}/>
        </>
    )
}