import React, { Component } from 'react';
import DeleteBtn from '../../components/DeleteBtn';
import { Jumbotron, Panel } from 'react-bootstrap';
import API from '../../utils/API';
import { Link } from 'react-router-dom';
import { Col, Row, Container } from '../../components/Grid';
import { List, ListItem } from '../../components/List';
import { Input, TextArea, FormBtn } from '../../components/Form';

class Queue extends Component {
  state = {
    queue: [],
    firstName: '',
    lastName: '',
    phoneNumber: '',
    partySize: '',
    notes: ''
  };

  componentDidMount() {
    this.loadQueue();
  }

  loadQueue = () => {
    API.getQueue()
      .then(res =>
        this.setState({
          guest: res.data,
          firstName: '',
          lastName: '',
          phoneNumber: '',
          notes: '',
          partySize: '',
          seated: Boolean,
          moveUp: Boolean,
          moveDown: Boolean
        })
      )
      .catch(err => console.log(err));
  };

  deleteGuest = id => {
    API.deleteGuest(id)
      .then(res => this.loadQueue())
      .catch(err => console.log(err));
  };

  handleInputChange = event => {
    const { name, value } = event.target;
    this.setState({
      [name]: value
    });
  };

  handleFormSubmit = event => {
    event.preventDefault();
    if (
      this.state.firstName &&
      this.state.phoneNumber &&
      this.state.partySize
    ) {
      API.saveGuest({
        firstName: this.state.firstName,
        lastName: this.state.lastName,
        phoneNumber: this.state.phoneNumber,
        partySize: this.state.partySize
      })
        .then(res => this.loadQueue())
        .catch(err => console.log(err));
    }
  };

  render() {
    return (
      <Container fluid>
        <Row>
          <Col size="md-12">
            <Jumbotron>
              <h1 className="text-center">U-Queue</h1>
            </Jumbotron>
          </Col>
        </Row>
        <Row>
          <Col size="md-6 sm-12">
            <form>
              <Input
                value={this.state.firstName}
                onChange={this.handleInputChange}
                name="firstName"
                placeholder="First Name (required)"
              />
              <Input
                value={this.state.lastName}
                onChange={this.handleInputChange}
                name="lastName"
                placeholder="Last Name (optional)"
              />
              <Input
                value={this.state.phoneNumber}
                onChange={this.handleInputChange}
                name="phoneNumber"
                placeholder="Phone Number (required)"
              />
              <Input
                value={this.state.partySize}
                onChange={this.handleInputChange}
                name="partySize"
                placeholder="Party Size (required)"
              />
              <Input
                value={this.state.notes}
                onChange={this.handleInputChange}
                name="notes"
                placeholder="Comments (optional)"
              />
              <FormBtn
                disabled={
                  !(
                    this.state.firstName &&
                    this.state.phoneNumber &&
                    this.state.partySize
                  )
                }
                onClick={this.handleFormSubmit}
              >
                Reserve a Table
              </FormBtn>
            </form>
          </Col>
          <Col size="md-5 sm-12">
            <h1>Current Queue</h1>
            {this.state.queue.length ? (
              <List>
                {this.state.queue.map(guest => (
                  <ListItem key={guest._id}>
                    <Link to={'/queue/' + guest._id}>
                      <strong>
                        {guest.firstName} {guest.lastName} {guest.partySize}{' '}
                        {guest.seated} {guest.notes}
                      </strong>
                    </Link>
                    <DeleteBtn onClick={() => this.deleteGuest(guest._id)} />
                  </ListItem>
                ))}
              </List>
            ) : (
              <h3>No Results to Display</h3>
            )}
          </Col>
        </Row>
      </Container>
    );
  }
}

export default Queue;