const { Op } = require('sequelize');
const {
  User,
  Group,
  Book,
  Comment,
  Note,
  BookGroup,
  UserBook,
  UserGroup,
  Poll,
} = require('./index.js');

// Check or Add new user to the database.
// Then, retrieve all group data for that user

const verifyUser = (token, tokenSecret, profile) => {
  return User.findOrCreate({
    where: { googleId: profile.id },
    defaults: {
      username: profile.displayName,
      email: profile.emails[0].value,
      token: token,
    },
  }).then(result => {
    return result;
  });
};

const deseralizeUser = (id) => {
  return User.findOne({
    where: { id: id }
  }).then(result => {
    return result;
  });
};

const getOwnerGroups = userId => {
  return Group.findAll({
    where: {
      userId,
    },
    include: [{ model: User }, { model: Book }],
  })
    .then(result => {
      return result;
    })
    .catch(err => {
      return err;
    });
};

const createNewGroup = (userId, groupName, bookId) => {
  return Group.create({
    name: groupName,
    userId,
    bookId: bookId || null,
  })
    .then(result => {
      return result;
    })
    .catch(err => {
      return err;
    });
};

const addOrFindBook = (
  isbn,
  title,
  author,
  published,
  description,
  urlInfo,
  image,
) => {
  return Book.findOrCreate({
    where: { isbn },
    defaults: {
      title,
      author,
      published,
      urlInfo,
      description,
      image,
    },
  })
    .then(result => {
      return result;
    })
    .catch(err => {
      return err;
    });
};

const getUserGroups = userId => {
  return UserGroup.findAll({
    attributes: [],
    where: {
      userId,
    },
    include: [
      {
        model: Group,
        include: [Book],
      },
    ],
  })
    .then(result => {
      let groups = result.map(group => {
        return group.group;
      });
      return groups;
    })
    .catch(err => {
      return err;
    });
};

const addUserToGroup = (userId, groupId) => {
  return UserGroup.findOrCreate({
    where: { userId, groupId },
  })
    .then(result => {
      return result;
    })
    .catch(err => {
      return err;
    });
};

const getGroupUsers = groupId => {
  return UserGroup.findAll({
    attributes: [],
    where: {
      groupId,
    },
    include: [{ model: User }],
  })
    .then(result => {
      let users = result.map(user => {
        return user.user;
      });
      return users;
    })
    .catch(err => {
      return err;
    });
};

const addBookToGroup = (groupId, bookId) => {
  return BookGroup.findOrCreate({
    where: { bookId, groupId },
  })
    .then(() => {
      return Group.update(
        { bookId },
        {where: {
          id: groupId,
        }}
      )
    })
    .then(() => {
      return Group.findOne({
        where: {
          id: groupId,
        },
        include: [{
          model: Book,
        }]
      })
    })
    .then(updatedGroup => 
      updatedGroup
    )
    .catch(err => {
      return err;
    });
};

const getGroupBooks = groupId => {
  return BookGroup.findAll({
    attributes: [],
    where: {
      groupId,
    },
    include: [{ model: Book }],
  })
    .then(result => {
      let book = result.map(book => {
        return book.book;
      });
      return book;
    })
    .catch(err => {
      return err;
    });
};

const addComment = (userId, groupId, bookId, comment) => {
  return Comment.create({
    comment,
    userId,
    groupId,
    bookId,
  })
    .then(result => {
      return result;
    })
    .catch(err => {
      return err;
    });
};

const getAllComments = (groupId, bookId) => {
  return Comment.findAll({
    where: {
      groupId,
      bookId,
    },
    include: [{ model: User }],
  })
    .then(result => {
      return result;
    })
    .catch(err => {
      return err;
    });
};

const searchGroups = query => {
  return Group.findAll({
    where: {
      name: {
        [Op.like]: `%${query}%`,
      },
    },
    include: [{ model: User }, { model: Book }],
  })
    .then(result => {
      return result;
    })
    .catch(err => {
      return err;
    });
};

const deleteGroup = groupId => {
  return Group.destroy({
    where: {
      id: groupId,
    },
  })
    .then(result => {
      return result;
    })
    .catch(err => {
      return err;
    });
};

const removeUserFromGroup = (userId, groupId) => {
  return UserGroup.destroy({
    where: {
      userId,
      groupId,
    }
  })
  .then((result) => {
    return result;
  }).catch((err) => {
    return err;
  });
}

const addMeetingToGroup = (groupId, nextMeeting) => {
return Group.update(
  {nextMeeting: nextMeeting}, 
  {where: {id: groupId}})
}

/**
 * Can make a poll of up to four books. presumes that the books are already in the database
 * @param {*} groupId - the id number of the group
 * @param {*} bookIds - an array of book ids that are being added to the poll.
 */

const makePoll = (groupId, bookIds) => {
  const bookAmount = bookIds.length;
  if(bookAmount < 2) {
    console.error("a poll must contain atleast two books");
    return;
  }
  return Group.findOne({where: {id: groupId}})
    .then(group => {
      return group.getPoll()
        .then(poll => {
          if(poll) {
            console.error("there is currently an active poll"); ////////////////////////////////// remove after testing.
            return "there is currently an active poll";
          }
          return group.getUsers_groups()
            .then(usersGroups => {
              let newPollObj = {
                currentVotes: 0,
                maxVotes: usersGroups.length,
                totalBooks: bookAmount,
                groupId,
              };
              // adds the books to the book Ids and sets the corrisponding book count to zero.
              bookIds.forEach((bookId, index) => {
                newPollObj["book" + (index + 1) + "Count"] = 0;
                newPollObj[`book${index + 1}Id`] = bookId;
              })
              return Poll.create(newPollObj)
                .then(newPoll => {
                  // creates a set of unfulfilled promises to make sure that the newPollObj.id gets added to all the userGroups before completing.
                  usersGroups.forEach(userGroup => userGroup.setPoll(newPoll.id));
                  return newPoll;
                })
            })
        })
    })
};

/**
 * 
 * @param {*} userId - user voting
 * @param {*} groupId - group with the poll
 * @param {*} bookId - book being voted on
 */
const addVote = (userId, groupId, bookId) => {
  return UserGroup.findOne({where: {userId, groupId}})
    .then(usergroup_polled => {
      if(usergroup_polled.selectedBookId) {
        if(usergroup_polled.selectedBookId === bookId) {
          return usergroup_polled.getPoll();
        }
        return usergroup_polled.getPoll()
          .then(poll => {
            let oldBook = 0;
            // finds the number of the old book in the poll table
            for(var i = 1; i <= 4; i++) {
              if(poll[`book${i}Id`] === usergroup_polled.selectedBookId) {
                oldBook = i;
              } 
            }
            // adds a count to the new book's poll and removes a count from the old book
            for(var i = 1; i <= 4; i++) {
              if(poll[`book${i}Id`] === bookId) {
                return poll.update({
                  [`book${i}Count`]: poll[`book${i}Count`] + 1,
                  [`book${oldBook}Count`]: poll[`book${oldBook}Count`] - 1,
                },
                {
                  fields: [`book${i}Count`, `book${oldBook}Count`]
                })
                  .then(() => usergroup_polled.setSelectedBook(bookId))
              }
            }
          })
      } else {
        return usergroup_polled.setSelectedBook(bookId)
          .then(() => usergroup_polled.getPoll())
          .then(poll => {
            // adds to poll
            for(var i = 1; i <= 4; i++) {
              if(poll[`book${i}Id`] === bookId) {
                return poll.update({
                  [`book${i}Count`]: poll[`book${i}Count`] + 1,
                  currentVotes: poll.currentVotes + 1
                }, 
                {
                  fields: [`book${i}Count`, 'currentVotes']
                });
              }
            }
          })
      }
    })
};

/**
 * 
 * @param {*} pollId 
 */
const endPoll = pollId => {
  return Poll.findOne({where: {id: pollId}})
  .then(poll => poll.destroy())
  .then(poll => UserGroup.findAll({where: {groupId: poll.groupId}}))
  .then(usergroups_polled => usergroups_polled.forEach(usergroup => {
    usergroup.setSelectedBook(null);
  }));
};

/**
 * 
 * @param {*} groupId 
 */
const getPoll = groupId => Poll.findOne({where: {groupId}});

module.exports = {
  verifyUser,
  createNewGroup,
  getUserGroups,
  addOrFindBook,
  getOwnerGroups,
  addUserToGroup,
  getGroupUsers,
  addBookToGroup,
  getGroupBooks,
  addComment,
  getAllComments,
  searchGroups,
  deleteGroup,
  removeUserFromGroup,
  deseralizeUser,
  addMeetingToGroup,
  makePoll,
  addVote,
  endPoll,
  getPoll,
};
