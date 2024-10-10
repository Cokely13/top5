

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchGroups } from '../store/allGroupsStore';
import { fetchInvites } from '../store/allInvitesStore';
import { Link } from 'react-router-dom';

function Groups() {
  const dispatch = useDispatch();
  const groups = useSelector((state) => state.allGroups);
  const invites = useSelector((state) => state.allInvites);
  const { id: currentUserId } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchGroups());
    dispatch(fetchInvites());
  }, [dispatch]);

  return (
    <div className="groups-page-container">
      <h1 className="groups-page-heading">
        <u>
          <b>Groups</b>
        </u>
      </h1>
      <div className="groups-page-card-container">
        {groups.map((group) => {
          const isMember =
            group.group_members &&
            group.group_members.some((member) => member.userId === currentUserId);
          const hasPendingInvite = invites.some(
            (invite) =>
              invite.groupId === group.id &&
              invite.inviteeId === currentUserId &&
              invite.status === 'pending'
          );

          return (
            <div key={group.id} className="groups-page-card">
              <Link to={`/groups/${group.id}`} className="groups-page-card-link">
                <div className="groups-page-card-image-container">
                  {group.image ? (
                    <img
                      src={group.image}
                      alt={`${group.name} Group`}
                      className="groups-page-card-image"
                    />
                  ) : (
                    <div className="groups-page-card-placeholder">
                      <i className="fas fa-users"></i>
                    </div>
                  )}
                  </div>
                  {isMember && (
                    <span className="groups-page-card-status member">Member</span>
                  )}
                  {hasPendingInvite && (
                    <span className="groups-page-card-status pending">Invite Pending</span>
                  )}

                <h2 className="groups-page-card-heading">{group.name}</h2>
                <p className="groups-page-card-members">
                  Members: {group.group_members ? group.group_members.length : 0}
                </p>
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Groups;
