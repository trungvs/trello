import React, { useState, useEffect, useRef } from "react"
import {
    Form,
    Input,
  } from 'antd';
  import { Button } from 'antd';
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { message, Popconfirm } from 'antd';

import { editTodo, deleteTodo, rankTodo } from "./TodoService"

function EditTodo(props) {
    const { 
        todo, 
        boardStyle, 
        onDragStart, 
        onDragEnter, 
        onDragEnd,
        onDrag,
        handleDeleteTodo,
    } = props

    const [isEdit, setIsEdit] = useState(false)

    const [form] = Form.useForm()
    const [name, setName] = useState("")

    const handleSubmit = () => {
        setIsEdit(false)
        editTodo(todo.id, { name: form.getFieldValue("name")})
        .then(res => {
            if (res.data.code === 200) {
                setName(res.data.data.name)
            }
        })
        .catch(err => console.log(err))
    }

    useEffect(() => {
        setName(todo.name)
    }, [])

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
                initialValue={name}
            >
                <Input.TextArea 
                    size="small" 
                    autoFocus 
                    onFocus={e => e.target.setSelectionRange(e.currentTarget.value.length, e.currentTarget.value.length)}
                />
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
                onDragStart={(e) => onDragStart(e, todo.id, todo.no, todo.board_id)}
                onDragEnter={(e) => onDragEnter(e, todo.no, todo.board_id)}
                onDragEnd={(e) => onDragEnd(e, todo.no, todo.board_id)}
                onDragOver={e => e.preventDefault()}
                onDrag={e => onDrag(e)}
            >
                <p className="board-item-name" style={{width: "100%", cursor: "text"}} onClick={() => setIsEdit(true)}>
                    {name}
                </p>
                <Popconfirm
                placement="topLeft"
                title={"Are you sure to delete this task?"}
                onConfirm={() => handleDeleteTodo(todo.id)}
                okText="Yes"
                cancelText="No"
                >
                    <Button type="dashed" icon={<DeleteOutlined />} size="small" />
                </Popconfirm>
            </li>
        }
        </>
    )
}

export default React.memo(EditTodo)