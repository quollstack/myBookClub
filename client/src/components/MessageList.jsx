import React from 'react';
import MessageListItem from './MessageListItem.jsx';
import { Collection } from 'react-materialize';

const MessageList = ({messages, user}) => (
  <Collection style={{border: 'none'}}>
    {messages.reverse().map((message) => {
      return <MessageListItem message={message} user={user}/>;
    })}
  </Collection>
);

export default MessageList;
