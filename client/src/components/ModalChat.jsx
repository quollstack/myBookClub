import React from 'react';
import { TextInput, Modal, Button, Row, Col } from 'react-materialize';
import Textarea from 'react-materialize/lib/Textarea';

class ModalChat extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      messageValue: '',
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(e) {
    const { value } = e.target;
    this.setState({
      messageValue: value,
    })
  }

  handleSubmit(e) {
    const { messageValue } = this.state;
    const { club, user } = this.props;
    const newMessage = {
      text: messageValue,
      authorId: user.id,
      group: club.name,
    }
    console.log(newMessage);
    this.setState({
      messageValue: ''
    });
    e.preventDefault();
  }

  render() {
    const { club, user } = this.props;
    const { messageValue } = this.state;
    return (
    <Modal header={`${club.name} Chat`} fixedFooter trigger={<Button>Group Chat</Button>}>
      <Row style={{height: '70%', overflowY: "scroll"}}>
        <Col>
          <p>blablhablhasbalhslahjhbkajb</p>
        </Col>
      </Row>
      <Row>
        <Col style={{width: '100%'}}>
          <form onSubmit={this.handleSubmit}>
            <Textarea value={messageValue} onChange={this.handleChange} icon="chat" placeholder="Enter message..." />
            <Button floating type="submit" className="teal" waves="light" icon="send" />
          </form>
        </Col>
      </Row>
    </Modal>
    )
  }
}

export default ModalChat;