import React from 'react';
import {View, Text,Button} from 'react-native';
import GroupChat from './GroupChat';
import GroupChatWindow from './GroupChatWindow';
import MessageInput from './MessageInput';

const GroupDiscussionScreen = ({ navigation }) => {
	return ( 
		<View> 
			<Text> Group Discussion </Text>
			<Button title="Go to Another Screen"
				onPress={() => navigation.navigate('AnotherScreen')}
				/>
		</View>
		);
};

export default GroupDiscussionScreen;
