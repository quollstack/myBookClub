import React from 'react';
import { CollectionItem, Chip } from 'react-materialize';

const MessageListItem = ({message, user}) => {
  if (message.author !== user.username) {
    return (
    <CollectionItem style={{border: 'none'}}>
      <div>
        <span className="title">{message.author}</span>
        <br/>
        <Chip>{message.text}</Chip>
      </div>
    </CollectionItem>
    )
  } else if (message.author === user.username) {
    return (
      <CollectionItem style={{border: 'none'}}>
        <div className="right-align">
          <span className="title">{message.author}</span>
          <br/>
          <Chip className="teal lighten-3">{message.text}</Chip>
        </div>
      </CollectionItem>
    )
  }
}

export default MessageListItem;