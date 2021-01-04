// eslint-disable-next-line import/prefer-default-export
export function broadcast(connections, userId, action, payload) {
  connections.forEach((connection) => {
    connection.emit(userId, action, payload);
  });
}
