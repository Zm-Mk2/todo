import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios, { AxiosResponse, AxiosError } from 'axios'
import styled from 'styled-components'
import { ImCheckboxChecked, ImCheckboxUnchecked } from 'react-icons/im'
import { AiFillEdit } from 'react-icons/ai'
import { validateLocaleAndSetLanguage } from 'typescript'
import { Todo } from '../Types'

const SearchAndButton = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const SearchForm = styled.input`
  font-size: 20px;
  width: 100%;
  height: 40px;
  margin: 10px 0;
  padding: 10px;
`

const RemoveAllButton = styled.button`
  width: 16%;
  height: 40px;
  background: #f54242;
  border: none;
  font-weight: 500;
  margin-left: 10px;
  padding: 5px 10px;
  border-radius: 3px;
  color: #fff;
  cursor: pointer;
`

type Tprops = {
    is_completed: boolean
}

const TodoName = styled.span<Tprops>`
  font-size: 27px;
  ${({ is_completed }) => is_completed && `
    opacity: 0.4;
  `}
`

const Row = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 7px auto;
  padding: 10px;
  font-size: 25px;
`

const CheckedBox = styled.div`
  display: flex;
  align-items: center;
  margin: 0 7px;
  color: green;
  cursor: pointer;
`

const UncheckedBox = styled.div`
  display: flex;
  align-items: center;
  margin: 0 7px;
  cursor: pointer;
`

const EditButton = styled.span`
  display: flex;
  align-items: center;
  margin: 0 7px;
`

function TodoList() {
    const [todos, setTodos] = useState<Todo[]>([])
    const [searchName, setSearchName] = useState<string>('')

    const axiosBase = require('axios')
    const axios = axiosBase.create({
        baseURL: process.env.REACT_APP_DEV_API_URL,
        headers: {
            'Content-Type': 'application/json',
            'X-Requested-with': 'XMLHttpRequest'
        },
        ResponseType: 'json'
    })

    useEffect(() => {
        axios.get('/todos')
        .then((resp: AxiosResponse) => {
            console.log(resp.data)
            setTodos(resp.data);
        })
        .catch((e: AxiosError) => {
            console.log(e)
        })
    }, [])

    const removeAllTodos = () => {
        const sure: boolean = window.confirm('Are you sure?')
        if (sure) {
            axios.delete('/todos/destroy_all')
            .then((resp: AxiosResponse) => {
                setTodos([])
            })
            .catch((e: AxiosError) => {
                console.log(e)
            })
        }
    }

    const updateIsCompleted = (index: number, val: Todo) => {
        var data: Todo = {
            id: val.id,
            name: val.name,
            is_completed: !val.is_completed
        }
        axios.patch(`/todos/${val.id}/`, data)
        .then((resp: AxiosResponse) => {
            const newTodos: Todo[] = [...todos]
            newTodos[index].is_completed = resp.data.is_completed
            setTodos(newTodos)
        })
    }

    return (
        <>
            <h1>Todo List</h1>
            <SearchAndButton>
                <SearchForm
                    type="text"
                    placeholder="Search todo..."
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                        setSearchName(event.target.value)
                    }}
                />
                <RemoveAllButton onClick={removeAllTodos}>Remove All</RemoveAllButton>
            </SearchAndButton>

            <div>
                {todos.filter((val) => {
                    if(searchName === "") {
                        return val
                    } else if (val.name.toLowerCase().includes(searchName.toLowerCase())) {
                        return val
                    }

                }).map((val, key) => {
                    return (
                        <Row key={key}>
                            {val.is_completed ? (
                                <CheckedBox>
                                    <ImCheckboxChecked onClick={() => updateIsCompleted(key, val) }/>
                                </CheckedBox>
                            ) : (
                                <UncheckedBox>
                                    <ImCheckboxChecked onClick={() => updateIsCompleted(key, val) }/>
                                </UncheckedBox>
                            )}
                            <TodoName is_completed={val.is_completed}>
                                {val.name}
                            </TodoName>
                            <Link to={"/todos/" + val.id + "/edit"}>
                                <EditButton>
                                    <AiFillEdit />
                                </EditButton>
                            </Link>
                        </Row>
                    )
                })}
            </div>
        </>
    )
}

export default TodoList
