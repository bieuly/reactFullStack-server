import Server from 'socket.io';

const PORT = 8090;

export default function startServer(store) {
	const io = new Server().attach(PORT);
	console.log(`Socket.io server running on port: ${PORT}`);

	store.subscribe(()=>{
		// Emits event when something has changed in the store
		io.emit('state', store.getState().toJS());
	});

	// Every time a client connects to the server return the current state
	io.on('connection', (socket)=>{
		socket.emit('state', store.getState().toJS());
		// ??? dispatch.bind ???
		socket.on('action', store.dispatch.bind(store));
	});
}

// A client sends an action to the server.
// The server hands the action to the Redux Store.
// The Store calls the reducer and the reducer executes the logic related to the action.
// The Store updates its state based on the return value of the reducer.
// The Store executes the listener function subscribed by the server.
// The server emits a 'state' event.
// All connected clients - including the one that initiated the original action - receive the new state.