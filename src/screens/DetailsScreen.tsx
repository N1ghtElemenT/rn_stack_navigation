import { View, Text } from 'react-native'
import { RootStackParamList } from '../navigation/AppNavigator';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

type Props = NativeStackScreenProps<RootStackParamList, "Details">;

export default function DetailsScreen({ route }: Props) {
    const { username } = route.params;
    
    return (
        <View>
            <Text> Details about: {username} </Text>
        </View>
    );
}