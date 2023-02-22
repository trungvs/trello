import React, { useState, useRef } from "react";

import {
    Form,
    Input,
  } from 'antd';

  import { editBoard } from "../Boards/BoardServices";

export default function EditNameTodo(props) {
    const { id, nameTodo, reload } = props

    const [isEdit, setIsEdit] = useState(false)
    const inputRef = useRef()

    const [form] = Form.useForm()
    const handleSubmit = (values) => {
        setIsEdit(false)
        editBoard(id, { name: form.getFieldValue("name")})
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
            isEdit
            ? <Form onFinish={handleSubmit} form={form} onKeyPress={(e) => {
                if (e.key === "Enter") {
                  handleSubmit(form.values)
                }
              }} ref={inputRef}>
            <Form.Item name="name" style={{ marginBottom: 0}} rules={[
            {
                required: true,
                message: 'Trường này là bắt buộc!'
            }
            ]}
            initialValue={nameTodo}
            >
                <Input size="large" autoFocus/>
            </Form.Item>
                </Form>
            : <span style={{ display: "block", width: "100%" }} onClick={() => setIsEdit(true)}>{nameTodo}</span>
        }
        </>
    )
}