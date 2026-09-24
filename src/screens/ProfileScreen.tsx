import { useState } from 'react';
import { View, Text, Button, TextInput } from 'react-native'
import { RootStackParamList } from '../navigation/AppNavigator';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

type Props = NativeStackScreenProps<RootStackParamList, "Profile">;

export default function ProfileScreen({ navigation }: Props) {
    const [name, setName] = useState('');

    const openDetails = () => {
        const username = name.trim();
        if (!username) {
            return;
        }
        navigation.navigate("Details", { username });
    };

    return (
        <View>
            <Text> Profile </Text>
            <TextInput value={name} onChangeText={setName} placeholder="Enter your name" autoCapitalize="words" />
            <Button title="Open Details" onPress={openDetails} />
        </View>
    );
}
