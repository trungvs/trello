import React, { useState, useEffect, useRef } from "react"
import {
    Form,
    Input,
  } from 'antd';
  import { Button } from 'antd';
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";

import { editTodo, deleteTodo, rankTodo } from "./TodoService"

export default function EditTodo(props) {
    const { 
        todo, 
        boardStyle, 
        reload, 
        onDragStart, 
        onDragEnter, 
        onDragEnd 
    } = props

    const [isEdit, setIsEdit] = useState(false)

    const [form] = Form.useForm()

    const dragItem = useRef()
    const dragOverItem = useRef()

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

    const handleDeleteTodo = (id) => {
        deleteTodo(id)
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
            ? <Form 
                onFinish={handleSubmit} 
                form={form} 
                onKeyPress={(e) => {
                if (e.key === "Enter") {
                  handleSubmit(form.values)
                }}} 
                onBlur={() => handleSubmit(form.values)}
                >
                <Form.Item name="name" style={{ marginBottom: "10px"}} rules={[
                {
                    required: true,
                    message: 'Trường này là bắt buộc!'
                }
                ]}
                initialValue={todo.name}
            >
                <Input.TextArea size="small" autoFocus onFocus={e => e.target.setSelectionRange(e.currentTarget.value.length, e.currentTarget.value.length)}/>
                </Form.Item>
            </Form>
            : <li 
                className="board-item" 
                style={boardStyle.item} 
                key={todo.id} 
                data-value={todo.id}
                ranking={todo.no}
                board-id={todo.board_id}
                draggable
                onDragStart={(e) => onDragStart(e, todo.id, todo.no)}
                onDragEnter={(e) => onDragEnter(e, todo.no, todo.board_id)}
                onDragEnd={(e) => onDragEnd(e, todo.no, todo.board_id)}

            >
                <p className="board-item-name" style={{width: "100%"}} onClick={() => setIsEdit(true)}>
                    {todo.name}
                </p>
            <Button type="dashed" icon={<DeleteOutlined />} size="small" onClick={() => handleDeleteTodo(todo.id)}/>
            </li>
        }
        </>
    )
}