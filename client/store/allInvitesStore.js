import Axios from "axios";

const SET_INVITES ="SET_INVITES"
const CREATE_INVITE = "CREATE_INVITE"
const DELETE_INVITE = "DELETE_INVITE"


export const setInvites = (invite) =>{
  return{
    type: SET_INVITES,
    invite
  }
};

const _createInvite = (invite) => {
  return {
    type: CREATE_INVITE,
    invite,
  };
};

const _deleteInvite = (invite) => {
  return {
    type: DELETE_INVITE,
    invite
  };
};

export const fetchInvites = () => {
  return async (dispatch) => {
        const {data}= await Axios.get("/api/invites");
        dispatch(setInvites(data));
  };
};

export const createInvite = (invite) => {
  return async (dispatch) => {
    const { data: created } = await Axios.post("/api/invites", invite);
    dispatch(_createInvite(created));
    // history.push("/invites");
  };
};

export const deleteInvite = (id, history) => {
  return async (dispatch) => {
    const { data: invite } = await Axios.delete(`/api/invites/${id}`);
    dispatch(_deleteInvite(invite));
    history.push("/invites");
  };
};


const initialState = [];
export default function invitesReducer(state = initialState, action) {
  switch (action.type) {
    case SET_INVITES:
      return action.invite;
      case CREATE_INVITE:
        return [...state, action.invite];
        case DELETE_INVITE:
      return state.filter((invite) => invite.id !== action.invite.id)
      ;
      default:
        return state;
    }
  }
