import React, { useState, useMemo } from "react"
import {
    Form,
    Input,
  } from 'antd';
  import { Button } from 'antd';
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";

import { editTodo, getTodoById } from "./TodoService"

export default function EditTodo({ todo, boardStyle, reload }) {
    const [isEdit, setIsEdit] = useState(false)

    const [form] = Form.useForm()

    const handleSubmit = () => {
        setIsEdit(false)
        editTodo(todo.id, { name: form.getFieldValue("name")})
        .then(res => {
            if (res.data.code === 200) {
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
              }}>
            <Form.Item name="name" style={{ marginBottom: "10px"}} rules={[
            {
                required: true,
                message: 'Trường này là bắt buộc!'
            }
            ]}
            initialValue={todo.name}
            >
                <Input.TextArea size="large" autoFocus/>
            </Form.Item>
                </Form>
            : <li className="board-item" style={boardStyle.item} key={todo.id}  draggable>
            <p className="board-item-name">
                {todo.name}
            </p>
            <Button type="dashed" icon={<EditOutlined />} size="small" onClick={() => setIsEdit(true)}/>
            </li>
        }
        </>
    )
}