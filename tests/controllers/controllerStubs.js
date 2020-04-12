
const sinon = require('sinon');
const faker = require('faker');

function RequestStub() {
  this.body = {};
  this.query = {};
  this.params = {};
  this.user = { userId: faker.random.number() };
  this.file = {};
}

function ResponseStub() {
  this.status = sinon.stub().returns(this);
  this.json = sinon.spy();
  this.set = sinon.spy();
  this.send = sinon.spy();
  this.sendStatus = sinon.spy();
}

module.exports = { RequestStub, ResponseStub };
