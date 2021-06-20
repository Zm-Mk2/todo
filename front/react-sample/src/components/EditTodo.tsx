import React, { useState, useEffect } from 'react'
import axios, { AxiosResponse, AxiosError } from 'axios'
import styled from 'styled-components'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { Todo } from '../Types'
import { RouteComponentProps } from 'react-router-dom'
import { createPartiallyEmittedExpression } from 'typescript'


const InputName = styled.input`
  font-size: 20px;
  width: 100%;
  height: 40px;
  padding: 2px 7px;
  margin: 12px 0;
`

const CurrentStatus = styled.div`
  font-size: 19px;
  margin: 8px 0 12px 0;
  font-weight: bold;
`

const IsCompletedButton = styled.button`
  color: #fff;
  font-weight: 500;
  font-size: 17px;
  padding: 5px 10px;
  background: #f2a115;
  border: none;
  border-radius: 3px;
  cursor: pointer;
`

const EditButton = styled.button`
  color: #fff;
  font-weight: 500;
  font-size: 17px;
  padding: 5px 10px;
  margin: 0 10px;
  background: #0ac620;
  border: none;
  border-radius: 3px;
  cursor: pointer;
`

const DeleteButton = styled.button`
  color: #fff;
  font-weight: 500;
  font-size: 17px;
  padding: 5px 10px;
  background: #f54242;
  border: none;
  border-radius: 3px;
  cursor: pointer;
`

toast.configure()

type UserProps = {} & RouteComponentProps<{id: string}>;

function EditTodo(props: UserProps) {

    const initialTodoState = {
        id: "",
        name: "",
        is_completed: false
    }

    const [currentTodo, setCurrentTodo] = useState<Todo>(initialTodoState)

    const notify = () => {
        toast.success('Todo successfully updated!', {
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

    const getTodo = (id: string) => {
        axios.get(`/todos/${id}`)
        .then((resp: AxiosResponse) => {
            setCurrentTodo(resp.data)
        })
        .catch((e: AxiosError) =>{
            console.log(e)
        })
    }

    useEffect(() => {
        getTodo(props.match.params.id)
    }, [props.match.params.id])

    const handeleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setCurrentTodo({ ...currentTodo, [name]: value })
    }

    const updateIsCompleted = (val: Todo) => {
        var data = {
            id: val.id,
            name: val.name,
            is_completed: !val.is_completed
        }
        axios.patch(`/todos/${val.id}`, data)
        .then((resp: AxiosResponse) => {
            setCurrentTodo(resp.data)
        })
    }

    const updateTodo = () => {
        axios.patch(`/todos/${currentTodo.id}`, currentTodo)
        .then((resp: AxiosResponse) => {
            notify()
            props.history.push('/todos')
        })
        .catch((e: AxiosError) => {
            console.log(e)
        })
    }

    const deleteTodo = () => {
        axios.delete(`/todos/${currentTodo.id}`)
        .then((resp: AxiosResponse) => {
            props.history.push('/todos')
        })
        .catch((e: AxiosError) => {
            console.log(e)
        })
    }

    return (
        <>
            <h1>Editing Todo</h1>
            <div>
                <div>
                    <label htmlFor="name">Current Name</label>
                    <InputName
                        type="text"
                        name="name"
                        value={currentTodo.name}
                        onChange={handeleInputChange}
                    />
                    <div>
                    <span>Current Status</span>
                    <CurrentStatus>
                        {currentTodo.is_completed ? "Completed" : "Uncompleted"}
                    </CurrentStatus>
                    </div>
                </div>
                {currentTodo.is_completed ? (
                    <IsCompletedButton onClick={() => updateIsCompleted(currentTodo)}>
                        Uncompleted
                    </IsCompletedButton>
                ) : (
                    <IsCompletedButton onClick={() => updateIsCompleted(currentTodo)}>
                        Completed
                    </IsCompletedButton>
                )}
                <EditButton onClick={updateTodo}>
                    Update
                </EditButton>
                <DeleteButton onClick={deleteTodo}>
                    Delete
                </DeleteButton>
            </div>
        </>
    )
}

export default EditTodo
