import { Image } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/tab-screens/HomeScreen';
import ProfileScreen from '../screens/tab-screens/ProfileScreen';
import DetailsScreen from '../screens/tab-screens/DetailScreen';

export type RootTabParamList = {
    Home: undefined;
    Profile: undefined;
    Details: { username: string };
};

const Tab = createBottomTabNavigator<RootTabParamList>();

type TabIconProps = { focused: boolean };

const makeTabIcon = (source: number) => {
    const TabIcon = ({ focused }: TabIconProps) => (
        <Image
            source={source}
            style={{
                width: 24,
                height: 24,
                opacity: focused ? 1 : 0.5,
            }}
        />
    );
    TabIcon.displayName = 'TabIcon';
    return TabIcon;
};

const icons = {
    home: makeTabIcon(require('../../assets/icons/home-icon-png.png')),
    profile: makeTabIcon(require('../../assets/icons/profile.png')),
    details: makeTabIcon(require('../../assets/icons/details.png')),
};

export const AppTabNavigator = () => {
    return (
        <Tab.Navigator>
            <Tab.Screen
                name="Profile"
                component={ProfileScreen}
                options={{ tabBarIcon: icons.profile }}
            />
            <Tab.Screen
                name="Home"
                component={HomeScreen}
                options={{ tabBarIcon: icons.home }}
            />
            <Tab.Screen
                name="Details"
                component={DetailsScreen}
                options={{ tabBarIcon: icons.details }}
            />
        </Tab.Navigator>
    );
};