import React from 'react';
import socketIOClient from "socket.io-client";
import MessageList from './MessageList.jsx';
import { Textarea, Modal, Button, Row, Col } from 'react-materialize';
import fakeMessages from '../../../database/sample-data/fakeMessages';
const io = socketIOClient;

class ModalChat extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      messageValue: '',
      messages: fakeMessages
    };

    this.socket = io();

    this.socket.on('RECIEVE_MESSAGE', (message) => {
      this.addMessage(message);
    })

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.addMessage = this.addMessage.bind(this);
  }

  handleChange(e) {
    const { value } = e.target;
    this.setState({
      messageValue: value,
    })
  }

  addMessage(message) {
    console.log(message);
    this.setState({
      messages: [...this.state.messages, message]
    });
    console.log(this.state.messages);
  }

  handleSubmit(e) {
    const { messageValue } = this.state;
    const { club, user } = this.props;
    const newMessage = {
      text: messageValue,
      authorId: user.id,
      author: user.username,
      group: club.name,
      groupId: club.id,
    }
    this.socket.emit('SEND_MESSAGE', newMessage);
    this.setState({
      messageValue: ''
    });
    e.preventDefault();
  }

  render() {
    const { club, user } = this.props;
    const { messageValue, messages } = this.state;
    return (
    <Modal header={`${club.name} Chat`} fixedFooter trigger={<Button>Group Chat</Button>}>
      <Row style={{height: '69%', overflowY: 'scroll'}}>
        <Col style={{width: '100%'}}>
          <MessageList messages={messages} user={user} />
        </Col>
      </Row>
      <Row>
        <Col style={{width: '100%'}}>
          <form onSubmit={this.handleSubmit}>
            <Textarea s={11} m={11} l={11} xl={11} value={messageValue} onChange={this.handleChange} icon="chat" placeholder="Enter message..." />
            <Button floating type="submit" className="teal" waves="light" icon="send" />
          </form>
        </Col>
      </Row>
    </Modal>
    )
  }
}

export default ModalChat;