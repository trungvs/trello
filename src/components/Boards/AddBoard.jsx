import React, { useState } from "react";
import { CloseCircleOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { Card } from 'antd';
import {
    Form,
    Input,
  } from 'antd';

import { addBoard } from "./BoardServices";

export default function AddBoard({ reload })  {

    const [open, setOpen] = useState(false)
    const [form] = Form.useForm()

    const handleSubmit = (values) => {
        addBoard(values)
        .then(res => {
            if (res.data.code === 200) {
                console.log("thanh cong")
                reload()
            }
        })
        .catch(err => console.log(err))
    }

    return (
        <>
        {
            open
            ? <Card title="Thêm mới" extra={<Button type="dashed" icon={<CloseCircleOutlined />} size="large" onClick={() => setOpen(false)}>
            </Button>} style={{ width: 300 }}>
            <Form onFinish={handleSubmit} form={form}>
                <Form.Item name="name" style={{ marginBottom: "10px" }} rules={[
                {
                    required: true,
                    message: 'Trường này là bắt buộc!'
                }
                ]}>
                    <Input allowClear size="large" />
                </Form.Item>
                    <Button type="primary" htmlType="submit" size="large" style={{ marginRight: "10px" }}>
                    Thêm mới
                    </Button>
            </Form>
            </Card>
            : <Button type="primary" icon={<PlusCircleOutlined />} size="large" style={{ width: "300px"}} onClick={() => setOpen(true)}>
            Thêm mới
          </Button>
        }
            
        </>
    )

}