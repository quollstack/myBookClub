import React from 'react';
import { TextInput, Modal, Button, Row, Col } from 'react-materialize';

class ModalChat extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
    <Modal header="Group Chat" fixedFooter trigger={<Button>Group Chat</Button>}>
      <Row>
        <Col>
          <p>blablhablhasbalhslahjhbkajb</p>
        </Col>
      </Row>
      <Row>
        <Col>
          <TextInput s={10} m={10} l={10} xl={10} icon="chat" placeholder="Enter message..." />
          <Button floating className="teal" waves="light" icon="send" />
        </Col>
      </Row>
    </Modal>
    )
  }
}

export default ModalChat;