import React from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    font-size: 1rem;
    max-width: 600px;
    padding: 0.5rem 1.5rem;
`

const MessageBubbleSelf = styled.div`
    display: flex;
    border-radius: 1.15rem;
    line-height: 1.25;
    max-width: 75%;
    padding: 0.5rem .875rem;
    position: relative;
    word-wrap: break-word;
    align-self: flex-end;
    background-color: #7329F0;
    color: #fff;
    margin: 0.25rem 0 0;
    width: fit-content;
    &:before {
        border-bottom-left-radius: 0.8rem 0.7rem;
        border-right: 1rem solid #248bf5;
        right: -0.35rem;
        transform: translate(0, -0.1rem);
    }
    &:after {
        background-color: #fff;
        border-bottom-left-radius: 0.5rem;
        right: -40px;
        transform:translate(-30px, -2px);
        width: 10px;
    }
`

const MessageBubbleThem = styled.div`
    display: flex;
    border-radius: 1.15rem;
    line-height: 1.25;
    max-width: 75%;
    padding: 0.5rem .875rem;
    position: relative;
    word-wrap: break-word;
    align-items: flex-start;
    background-color: #e5e5ea;
    color: #000;
    margin: 0.25rem 0 0;
    width: fit-content;
    &:before {
        border-bottom-right-radius: 0.8rem 0.7rem;
        border-left: 1rem solid #e5e5ea;
        left: -0.35rem;
        transform: translate(0, -0.1rem);
    }
    &:after {
        background-color: #fff;
        border-bottom-right-radius: 0.5rem;
        left: 20px;
        transform: translate(-30px, -2px);
        width: 10px;
    }
`

function Message({ messages, selfHandle, post }) {
    console.log(messages)
    return (
        <Wrapper>
            { messages.map(msg => {
                if (msg.from === selfHandle) {
                    return <MessageBubbleSelf key={msg.createdAt}>
                        <p>{msg.content}</p>
                    </MessageBubbleSelf>
                } else {
                    return <MessageBubbleThem key={msg.createdAt}>
                        <p>{msg.content}</p>
                    </MessageBubbleThem>
                }
            })}
        </Wrapper>
        
    );
};

export default Message;