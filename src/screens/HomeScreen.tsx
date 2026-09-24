import { View, Text, Button } from 'react-native'
import { RootStackParamList } from '../navigation/AppNavigator';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

type Props = NativeStackScreenProps<RootStackParamList, "Home">;

export default function HomeScreen({ navigation }: Props) {
    return (
        <View>
            <Text> Home </Text>
            <Button title="Open Profile" onPress={() => navigation.navigate("Profile")} />
        </View>
    );
}