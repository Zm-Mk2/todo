import React, { useState } from 'react'
import axios, { AxiosResponse, AxiosError } from 'axios'
import styled from 'styled-components'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { FiSend } from 'react-icons/fi'
//import { validateLocaleAndSetLanguage } from 'typescript'
import { RouteComponentProps } from 'react-router-dom'
import { Todo } from '../Types'

const InputAndButton = styled.div`
    display: flex;
    justify-content: space-between;
    margin-top:20px;
`
const InputName = styled.input`
    font-size: 20px;
    width: 100%;
    heigth: 40px;
    padding: 2px, 7px;
`

type TProps = {
    disabled: boolean
}

const Button = styled.button<TProps>`
    font-size: 20px;
    border: none;
    border-radius: 3px;
    margin-left: 10px;
    padding: 2px 10px;
    background: #1E90FF;
    color: #fff;
    text-align: center;
    cursor: pointer;
    ${({ disabled }) => disabled && `
        opacity: 0.5;
        cursor: default;    
    `}
`

const Icon = styled.span`
    display: flex;
    align-items: center;
    margin: 0 7px;
`
toast.configure()

type UserProps = {} & RouteComponentProps<{id: string}>;

function AddTodo(props: UserProps) {
    const initialTodoState: Todo = {
        id: "",
        name: "",
        is_completed: false
    }

    const [todo, setTodo] = useState<Todo>(initialTodoState)

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setTodo({ ...todo, [name]: value })
    }

    const notify = () => {
        toast.success('Todo successfully created!', {
            position: 'bottom-center',
            hideProgressBar: true
        })
    }

    const axiosBase = require('axios')
    const axios = axiosBase.create({
        baseURL: process.env.REACT_APP_DEV_API_URL,
        headers: {
            'Content-Type': 'application/json',
            'X-Requested-with': 'XMLHttpRequest'
        },
        ResponseType: 'json'
    })

    const saveTodo = () => {
        var data = {
            name: todo.name,
        }
        axios.post('/todos', data)
        .then((resp: AxiosResponse) => {
            setTodo({
                id: resp.data.id,
                name: resp.data.name,
                is_completed: resp.data.is_completed
            })
            notify()
            props.history.push('/todos')
        })
        .catch((e: AxiosError) => {
            console.log(e)
        })
    }

    return (
        <>
            <h1>New Todo</h1>
            <InputAndButton>
                <InputName
                    type="text"
                    required
                    value={todo.name}
                    name="name"
                    onChange={handleInputChange}
                />
                <Button
                    onClick={saveTodo}
                    disabled={(!todo.name || /^\s*$/.test(todo.name))}
                >
                    <Icon>
                        <FiSend />
                    </Icon>
                </Button>
            </InputAndButton>
        </>
    )
}

export default AddTodo
