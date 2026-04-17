const Notification = ({ message, type }) => {
  if (!message) {
    return null;
  }

  const notificationStyle = {
    backgroundColor: type === 'error' ? '#f8d7da' : '#d4edda',
    color: type === 'error' ? '#721c24' : '#155724',
    border: `2px solid ${type === 'error' ? '#f5c6cb' : '#c3e6cb'}`,
    borderRadius: '4px',
    padding: '10px',
    marginBottom: '10px',
    fontSize: '16px',
    fontWeight: 'bold',
  };

  return (
    <div style={notificationStyle}>
      {message}
    </div>
  );
};

export default Notification;
