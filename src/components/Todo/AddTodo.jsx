import React, {useState} from "react";
import { Button } from "antd";
import {
    Form,
    Input,
  } from 'antd';
import { CloseOutlined } from "@ant-design/icons";

import { addTodo } from "./TodoService";

export default function AddTodo(props) {
    const { board, reload, handleAddTodo } = props

    const [openEdit, setOpenEdit] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const [form] = Form.useForm()

    const handleSubmit = (values) => {
        setIsLoading(true)
        addTodo({
            board_id: board.id,
            name: form.getFieldValue("content")
        })
        .then(res => {
            if (res.data.code === 200) {
                console.log("thanh cong add todo")
                handleAddTodo(res.data.data)
                form.resetFields()
                setIsLoading(false)
            }
        })
        .catch(err => console.log(err))
    }

    return (
        <>
        {
            openEdit
            ? <Form onFinish={handleSubmit} form={form} >
                <Form.Item name="content" style={{ marginBottom: "10px" }} rules={[
                {
                    required: true,
                    message: 'Trường này là bắt buộc!'
                }
                ]}>
                    <Input.TextArea allowClear autoFocus />
                </Form.Item>
                    <Button type="primary" htmlType="submit" size="large" onClick={() => setOpenEdit(true)} style={{ marginRight: "10px" }} disabled={isLoading}>
                    Thêm mới
                    </Button>
                    <Button type="dashed" shape="circle" size="large" onClick={() => setOpenEdit(false)}>
                    <CloseOutlined size="large" />
                    </Button>
            </Form>
            : <Button type="dashed" block size="large" onClick={() => setOpenEdit(true)}>
                Thêm mới
            </Button>
        }
        </>
    )
}

// 1,2,3,4,5
// chuyen 4=>2
// chuyen 5=> 1