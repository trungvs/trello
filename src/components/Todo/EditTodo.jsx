import React, { useState, useEffect, useRef } from "react"
import {
    Form,
    Input,
  } from 'antd';
  import { Button } from 'antd';
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";

import { editTodo, deleteTodo, rankTodo } from "./TodoService"

export default function EditTodo({ todo, boardStyle, reload, handleSetNew }) {
    const [isEdit, setIsEdit] = useState(false)

    const [form] = Form.useForm()
    const [itemSelected, setItemSelected] = useState(null)
    const [currentRanking, setCurrentRanking] = useState(null)
    const [newRanking, setNewRanking] = useState(null)
    const [newBoard, setNewBoard] = useState(null)

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

    const handleDragStart = (e, todo) => {
        setItemSelected(todo)
        setCurrentRanking(todo.no)
        console.log("start", todo.id, todo.no)
    }

    const handleDragEnter = (e, todo) => {
        // setNewRanking(e.target.getAttribute("ranking") || e.target.parentNode.getAttribute("ranking"))
        // setNewBoard(e.target.parentNode.getAttribute("board-id"))
        // setNewRanking(todo.no)
        setNewBoard(todo.board_id)
        console.log("enter", dragOverItem.current, newBoard)
        dragOverItem.current = todo.no
    }

    const handleDrop = (e) => {
        e.preventDefault()
        console.log(itemSelected.id, currentRanking, dragOverItem.current, newBoard)
        console.log(itemSelected?.board_id, newBoard)
        if (itemSelected?.board_id === newBoard) {
            console.log("khac ne")
        }
        // rankTodo(itemSelected, {
        // currentRanking,
        // newRanking,
        // board_id: newBoard
        // })  
        // .then(res => {
        //     if (res.data.code === 200) {
        //         reload()
        //     }
        // })
        // .catch(err => console.log(err))
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
                <Input.TextArea size="large" autoFocus/>
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
                onDragStart={(e) => handleDragStart(e, todo)}
                onDragEnter={(e) => handleDragEnter(e, todo)}
                onDragEnd={(e) => handleDrop(e, todo.no)}
            >
                <p className="board-item-name" style={{ padding: "10px", width: "100%"}} onClick={() => setIsEdit(true)}>
                    {todo.name}
                </p>
            <Button type="dashed" icon={<DeleteOutlined />} size="small" style={{ marginRight: "10px"}} onClick={() => handleDeleteTodo(todo.id)}/>
            </li>
        }
        </>
    )
}