import { useDispatch, useSelector } from 'react-redux';
import React, { useEffect, useState } from 'react';
import { fetchInvites } from '../store/allInvitesStore';
import { updateSingleInvite } from '../store/singleInviteStore';
import { fetchGroups } from '../store/allGroupsStore';

function Invites() {
  const dispatch = useDispatch();
  const invites = useSelector((state) => state.allInvites);
  const groups = useSelector((state) => state.allGroups);
  const { id: currentUserId } = useSelector((state) => state.auth);

  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    dispatch(fetchInvites());
    dispatch(fetchGroups());
  }, [dispatch]);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobile = windowWidth <= 768;

  // Filter only pending invites for the current user
  const pendingUserInvites = invites.filter(
    (invite) => invite.inviteeId === currentUserId && invite.status === 'pending'
  );

  // Handle invite status update
  const handleInviteStatusChange = async (invite, status) => {
    const updatedInvite = { ...invite, status };
    await dispatch(updateSingleInvite(updatedInvite));
    dispatch(fetchInvites()); // Refetch invites after the status update
  };

  const inviteGroup = (invite) => {
    return groups.find((group) => group.id == invite.groupId);
  };

  return (
    <div className="page-container">
      <h1 className="page-heading">
        <u><b>Invites</b></u>
      </h1>
      {pendingUserInvites.length > 0 ? (
        isMobile ? (
          // Mobile layout: Card view
          pendingUserInvites.map((invite) => (
            <div className="invite-card" key={invite.id}>
              <div className="invite-card-row">
                <span className="invite-card-label">Group Name:</span>
                <span>{invite.group.name}</span>
              </div>
              <div className="invite-card-row">
                <span className="invite-card-label">Photo:</span>
                <span>
                  {inviteGroup(invite)?.image ? (
                    <img
                      src={inviteGroup(invite).image}
                      alt="Group"
                      className="invite-card-image"
                    />
                  ) : (
                    'Loading...'
                  )}
                </span>
              </div>
              <div className="invite-card-row">
                <span className="invite-card-label">Inviter:</span>
                <span>{invite.inviter.username}</span>
              </div>
              <div className="invite-card-row">
                <span className="invite-card-label">Status:</span>
                <span>{invite.status}</span>
              </div>
              <div className="invite-card-row invite-card-buttons">
                <button
                  className="accept-button"
                  onClick={() => handleInviteStatusChange(invite, 'accepted')}
                >
                  Accept
                </button>
                <button
                  className="decline-button"
                  onClick={() => handleInviteStatusChange(invite, 'rejected')}
                >
                  Decline
                </button>
              </div>
            </div>
          ))
        ) : (
          // Desktop layout: Grid view
          <div className="invitesGrid">
            {/* Header Row */}
            <div className="invitesGrid-header">Group Name</div>
            <div className="invitesGrid-header">Photo</div>
            <div className="invitesGrid-header">Inviter</div>
            <div className="invitesGrid-header">Status</div>
            <div className="invitesGrid-header">Accept</div>
            <div className="invitesGrid-header">Decline</div>

            {/* Data Rows */}
            {pendingUserInvites.map((invite) => (
              <React.Fragment key={invite.id}>
                <div className="invitesGrid-cell">{invite.group.name}</div>
                <div className="invitesGrid-cell">
                  {inviteGroup(invite)?.image ? (
                    <img
                      src={inviteGroup(invite).image}
                      alt="Group"
                      style={{
                        width: '100px',
                        height: '100px',
                        objectFit: 'cover',
                        borderRadius: '4px',
                      }}
                    />
                  ) : (
                    'Loading...'
                  )}
                </div>
                <div className="invitesGrid-cell">{invite.inviter.username}</div>
                <div className="invitesGrid-cell">{invite.status}</div>
                <div className="invitesGrid-cell">
                  <button
                    className="accept-button"
                    onClick={() => handleInviteStatusChange(invite, 'accepted')}
                  >
                    Accept
                  </button>
                </div>
                <div className="invitesGrid-cell">
                  <button
                    className="decline-button"
                    onClick={() => handleInviteStatusChange(invite, 'rejected')}
                  >
                    Decline
                  </button>
                </div>
              </React.Fragment>
            ))}
          </div>
        )
      ) : (
        <p className="no-invites-message">No pending invites found for you.</p>
      )}
    </div>
  );
}

export default Invites;
