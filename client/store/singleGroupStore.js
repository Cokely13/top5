import axios from "axios";

// Action Types
const SET_SINGLE_GROUP = "SET_SINGLE_GROUP";
const UPDATE_SINGLE_GROUP = "UPDATE_SINGLE_GROUP";
const TOKEN = "token";

// Action creators
export const _setSingleGroup= (groupdata) => {
  return {
    type: SET_SINGLE_GROUP,
    groupdata,
  };
};

const _updateSingleGroup = (groupdata) => {
  return {
    type: UPDATE_SINGLE_GROUP,
    groupdata,
  };
};

//Thunks
export const fetchGroup = (id) => {
  return async (dispatch) => {
    const { data } = await axios.get(`/api/groups/${id}`);
    dispatch(_setSingleGroup(data));
  };
};

// export const updateSingleGroup = (group, history) => {
//   return async (dispatch) => {
//     try {
//         await axios.put(`/api/groups/${group.id}`, group);
//         const { data: groupData } = await axios.get(`/api/groups/${group.id}`);
//         dispatch(_updateSingleGroup(groupData));
//         history.push(`/groups/${group.id}`)
//       }
//      catch (error) {
//       console.log("GROUP", group)
//     }
//   };
// };

export const updateSingleGroup = (group) => {
  return async (dispatch) => {
    try {
      const { data } = await axios.put(`/api/groups/${group.get('id')}`, group); // Passing FormData with 'id'
      dispatch(_updateSingleGroup(data)); // No need to fetch again, just use the response
    } catch (error) {
      console.error('GROUP UPDATE ERROR:', error);
    }
  };
};

// reducer
const initialState = {};
const singleGroupReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_SINGLE_GROUP:
      return action.groupdata;
    case UPDATE_SINGLE_GROUP:
      return action.groupdata;
    default:
      return state;
  }
};

export default singleGroupReducer;
