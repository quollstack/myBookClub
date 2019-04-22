import React from 'react';
import ModalChat from './ModalChat.jsx';
import {
  Row,
  Col,
  TextInput,
  Collection,
  CollectionItem,
  Card,
  Button,
  Icon,
  Modal,
  CardPanel,
  DatePicker,
} from 'react-materialize';

const BookClubView = ({
  club,
  book,
  userList,
  user,
  addBookToGroup,
  handleBookSearchInput,
  handleBookSearchSubmit,
  bookSearchResults,
  clubBookComments,
  handleCommentText,
  submitComment,
  handleNextMeeting,
  setNextMeeting,
  setActivePoll,
  activePoll,
  activePollBooks,
  potentialPollBooks,
  voteOnBook,
  endPoll,
  addPotentialPollBook,
  addToPotentialPoll,
  potentialPoll,
  addPoll,
} ) => {
  console.log(potentialPollBooks)
  return (
  <div className="bodygrid blue-grey lighten-5">
  <Row>
    <Col s={12} xl={6}>
        <Card header={<h4 className="header">{club.name}</h4>}>
        <Row>
          <h5>{book.title}</h5>
        </Row>
        <Row>
          <Col s={6} className="offset-s3">
            <img src={book.image} className="book responsive-img" alt="Book cover" />
          </Col>
        </Row>
        <Row>
          <article> {book.description} </article>
        </Row>
        <Row>
          <Col s={8} className="offset-s2">
          {
            user.id == club.userId ?
                  <Modal
                    fixedFooter
                    header="select a book"
                    trigger={
                        <Button className="blue-grey darken-2">
                          Change Book
                          <Icon right>edit</Icon>
                        </Button>
                    }
                  >
                    <TextInput
                      placeholder="search for books"
                      onChange={e => handleBookSearchInput(e)}
                    />
                    <Button
                      className="blue-grey darken-2"
                      onClick={() => handleBookSearchSubmit()}
                    >
                      Search
                    </Button>
                    {bookSearchResults.length ?
                      bookSearchResults.map(book => (
                        <Card key={book.id}>
                          <Row>
                            <h5>{book.volumeInfo.title}</h5>
                          </Row>
                          <Row>
                            <h6>{book.volumeInfo.authors.join(', ')}</h6>
                          </Row>
                          <Row>
                            <Col s={4}>
                              <img src={book.volumeInfo.imageLinks.smallThumbnail} className="book responsive-img" />
                            </Col>
                            <Col s={4}>
                              {book.volumeInfo.description.substring(0, 200)}
                            </Col>
                            <Col s={4}>
                              <Button
                                waves="light"
                                onClick={() => addBookToGroup(club.id, book)}
                                large
                                className="blue-grey darken-2 right modal-close"
                                style={{ marginTop: 'auto' }}
                              >
                                Select Book
                                <Icon right>
                                  add
                                </Icon>
                              </Button>
                            </Col>
                          </Row>
                        </Card>
                      )) :
                      <div />
                    }
                  </Modal>
            :<Button disabled>
              Change Book
              <Icon right>close</Icon>
            </Button>
          }
          </Col>
        </Row>
      </Card>
    </Col>
    <Col s={12} xl={6}>
      <Card header={<h4 className="header">Members:</h4>} >
        {
          userList.map(user =>(
            user.id == club.userId ?
              <Row key={user.id}>
                <Col s={10}> {user.username} </Col>
                <Col s={2} ><Icon left className="blue-text text-lighten-2 ownericon">how_to_reg</Icon></Col>
              </Row>
              : <Row key={user.id}>
                <Col s={10}> {user.username} </Col>
              </Row>
          ))
        }
      </Card>
    </Col>
    <Col s={12} xl={6}>
      <Card header={<h4 className="header">Choose Next Meeting:</h4>} >
        <Row>
          <Col>
          Next Meeting: {club.nextMeeting || 'select date below'}
          </Col>
          <Col>
            <input type="datetime-local" onChange={(event) => {handleNextMeeting(event.target.value)}}></input>
          </Col>
        </Row>
      </Card>
    </Col>
    {!!activePoll ? 
      (<Col s={12} xl={6}>
        <Card header={<h4 className="header">Vote on the next book</h4>}>
        {activePollBooks.map((book, index) => (
        <Row key={index} onClick={() => voteOnBook(book.id, club.id, user.id)}>
          <Col s={8}>
            {book.title}
          </Col>
          <Col s={4}>
            {activePoll[`book${index + 1}Count`]}
          </Col>
        </Row>
        ))}
        {/* the user id and club id are not the same data type so a == is used instead of === */}
        {user.id == club.userId ? 
          <Button className="modal-close" onClick={() => {endPoll(activePoll.id)}}>End Poll</Button>
          : ""}
        </Card>
      </Col>) : 
      //start of makeing a poll
      (<Modal
        fixedFooter
        trigger={<Button className="modal-close" onClick={() => {endPoll(poll.id)}}>Add Poll</Button>}
        header="Poll Books"
      >
      {potentialPoll.length >= 2 && potentialPoll.length <= 4 ? <Button
        waves="light"
        onClick={() => addPoll()}
        className="blue-grey darken-2"
      >Make Poll</Button> :
      <Button
      disabled
      >Make Poll</Button>}
      <Modal
          fixedFooter
          header="select a book"
          trigger={
              <Button className="blue-grey darken-2">
                Add Book
                <Icon right>edit</Icon>
              </Button>
          }
        >
          <TextInput
            placeholder="search for books"
            onChange={e => handleBookSearchInput(e)}
          />
          <Button
            className="blue-grey darken-2"
            onClick={() => addPotentialPollBook()}
          >
            Search
          </Button>
          {potentialPollBooks.map(book => (
              <Card key={book.id}>
                <Row>
                  <h5>{book.volumeInfo.title}</h5>
                </Row>
                <Row>
                  <h6>{book.volumeInfo.authors.join(', ')}</h6>
                </Row>
                <Row>
                  <Col s={4}>
                    <img src={book.volumeInfo.imageLinks.smallThumbnail} className="book responsive-img" />
                  </Col>
                  <Col s={4}>
                    {book.volumeInfo.description.substring(0, 200)}
                  </Col>
                  <Col s={4}>
                    <Button
                      waves="light"
                      onClick={() => addToPotentialPoll(book)}
                      large
                      className="blue-grey darken-2 right modal-close"
                      style={{ marginTop: 'auto' }}
                    >
                      Select Book
                      <Icon right>
                        add
                      </Icon>
                    </Button>
                  </Col>
                </Row>
              </Card>
            ))
          }
        </Modal>
        {potentialPoll.lenth !== 0 ?
          potentialPoll.map((book, index) => (
          <Card key={index}>
            <Row>
              <h5>{book.title}</h5>
            </Row>
            <Row>
              <h6>{book.author}</h6>
            </Row>
            <Row>
              <Col s={4}>
                <img src={book.image} className="book responsive-img" />
              </Col>
              <Col s={4}>
                {book.description.substring(0, 200)}...
              </Col>
              {/* may make this button remove the book */}
              {/* <Col s={4}>
                <Button
                  waves="light"
                  onClick={() => addToPotentialPoll(book)}
                  large
                  className="blue-grey darken-2 right modal-close"
                  style={{ marginTop: 'auto' }}
                >
                  Select Book
                  <Icon right>
                    add
                  </Icon>
                </Button>
              </Col> */}
            </Row>
          </Card>
        )): <div />}
      </Modal>
      )
      // end of making a poll
    }
  </Row>
    <Row>
      <Col s={4}>
      <Modal trigger={
          <Button>Add A Comment!</Button>
        }>
        <TextInput icon="chat" placeholder="your comment here" onChange={(input)=>{ handleCommentText(input) }} /> 
              <Button className="modal-close" onClick={ submitComment }  >Add Comment</Button> 
      </Modal>
      </Col>
      <Col s={4}>
        <ModalChat club={club} user={user} />
      </Col>
      <Col s={4}>
        <h5>Comments</h5>
      </Col>
    </Row>
    <Row>
      <Col s={12}>
      <div className='commentsSection'>
            <Collection>
              {clubBookComments.map((comment)=>{ 
                  return <CollectionItem 
                  key={comment.id}
                  
                  > 
                  <CardPanel>
                    <Row>
                      <Col s={4}>
                  {`${comment.user.username}:`}
                      </Col>
                    </Row>
                    <Row>
                      <Col s={12}>
                  {`${comment.comment}`}
                      </Col>
                    </Row>
                    <Row>
                      <Col s={6} className='offset-s7'>
                      {`${new Date(comment.createdAt).toString().slice(0, 15)} at ${new Date(comment.createdAt).toLocaleTimeString()} `}
                      </Col>
                    </Row>
                  </CardPanel>
                  </CollectionItem>
              })}
            </Collection>
      </div>
      </Col>
    </Row>
  </div>
)
                }
export default BookClubView;