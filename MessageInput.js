import React from 'react';

const MessageInput = ({ value, onChange, onSend }) => {
	const handleKeyPress = (event) => { 
		if (event.key === 'Enter') {
		onSend();
		}
	};

	return ( 
		<div>
			<input 
				type="text"
				value={value}
				onChange={onChange}
				onKeyPress={handleKeyPress}
			/>
			<button onClick={onSend}>Send</button>
		</div>
	);
};

export default MessageInput;
