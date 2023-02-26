import React, { useState, useRef, useEffect } from "react";

import {
    Form,
    Input,
  } from 'antd';

  import { editBoard } from "../Boards/BoardServices";

export default function EditNameTodo(props) {
    const { id, nameTodo, reload } = props

    const [render, setRender] = useState(false)
    const [isEdit, setIsEdit] = useState(false)
    const [inputRef, setInputRef] = useState(useRef())

    const [form] = Form.useForm()
    const handleSubmit = (values) => {
        setIsEdit(false)
        editBoard(id, { name: form.getFieldValue("name")})
        .then(res => {
            if (res.data.code === 200) {
                reload()
                console.log("thanh cong")
            }
        })
        .catch(err => console.log(err))
    }


    useEffect(() => {
        // if (setIsEdit) {
        //     setInputRef(inputRef?.current)
        // }
    }, [render])

    return (
        <>
        {
            isEdit
            ? <Form onFinish={handleSubmit} form={form} onKeyPress={(e) => {
                if (e.key === "Enter") {
                  handleSubmit(form.values)
                }
              }} onBlur={() => handleSubmit(form.values)}>
            <Form.Item name="name" style={{ marginBottom: 0}} rules={[
            {
                required: true,
                message: 'Trường này là bắt buộc!'
            }
            ]}
            initialValue={nameTodo}
            >
                <Input size="large" autoFocus ref={inputRef} onFocus={e => e.target.setSelectionRange(e.currentTarget.value.length, e.currentTarget.value.length)} />
            </Form.Item>
                </Form>
            : <span style={{ display: "block", width: "100%" }} onClick={() => {
                setIsEdit(true)
                // setRender(!render)
            }}>{nameTodo}</span>
        }
        </>
    )
}