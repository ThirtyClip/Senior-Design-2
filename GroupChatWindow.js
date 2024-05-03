import React from 'react';

const GroupChatWindow = ({ messages }) => { 
return (
	<div> 
		{messages.map((message, index) => (
			<div key={index}>
				<span>{message.sender}: </span>
				<span>{message.text}</span>
			</div>
	))}
	</div>
	);
};

export default GroupChatWindow;
