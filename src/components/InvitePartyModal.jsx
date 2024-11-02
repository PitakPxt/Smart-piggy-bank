import React, { useState } from 'react';

const InvitePartyModal: React.FC = () => {
  const [invitedFriends, setInvitedFriends] = useState<Friend[]>([]);

  const handleAddFriend = (friendData: Friend) => {
    if (!friendData) return;

    setInvitedFriends((prev) => {
      if (!Array.isArray(prev)) return [friendData];
      return [...prev, friendData];
    });
  };

  return (
    // Your component JSX here
  );
};

export default InvitePartyModal; 