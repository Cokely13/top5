// client/store/allMessagesStore.js
import Axios from 'axios';

const SET_MESSAGES = 'SET_MESSAGES';
const CREATE_MESSAGE = 'CREATE_MESSAGE';
const DELETE_MESSAGE = 'DELETE_MESSAGE';

const setMessages = (messages) => ({ type: SET_MESSAGES, messages });
const _createMessage = (message) => ({ type: CREATE_MESSAGE, message });
const _deleteMessage = (id) => ({ type: DELETE_MESSAGE, id });

export const fetchMessages = (groupId) => async (dispatch) => {
  const { data } = await Axios.get(`/api/messages/${groupId}`);
  dispatch(setMessages(data));
};

export const createMessage = (message) => async (dispatch) => {
  const { data } = await Axios.post('/api/messages', message);
  dispatch(_createMessage(data));
};

export const deleteMessage = (id) => async (dispatch) => {
  await Axios.delete(`/api/messages/${id}`);
  dispatch(_deleteMessage(id));
};

const initialState = [];

export default function messagesReducer(state = initialState, action) {
  switch (action.type) {
    case SET_MESSAGES:
      return action.messages;
    case CREATE_MESSAGE:
      return [...state, action.message];
    case DELETE_MESSAGE:
      return state.filter((message) => message.id !== action.id);
    default:
      return state;
  }
}
