import { useEffect, useLayoutEffect, useState } from 'react';
import {
    Dimensions,
    Image,
    ImageBackground,
    Modal,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";

import { useNavigation } from '@react-navigation/native';

import { User } from '../types/user';
import { generatePositions } from '../utils/positionUtils';


const { width, height } = Dimensions.get('window');
const positions = generatePositions(3);




const mockUsers: User[] = [
    {
        id: 1,
        name: "User 1",
        avatar: require('../assets/images/avatar1.png'),
        focusSessions: 5,
        position: positions[0]
    },
    {
        id: 2,
        name: "User 2",
        avatar: require('../assets/images/avatar2.png'),
        focusSessions: 11,
        position: positions[1]
    },
    {
        id: 3,
        name: "User 3",
        avatar: require('../assets/images/avatar3.png'),
        focusSessions: 22,
        position: positions[2]
    },
];


export default function FocusScreen() {
    const [users, setUsers] = useState<User[]>([]);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [showModal, setShowModal] = useState(false);

    const navigation = useNavigation<any>();

    useLayoutEffect(() => {
        navigation.setOptions({ headerShown: false, title: '' });
    }, [navigation]);


   useEffect(() => {
        setUsers(mockUsers);
    }, []);

    
    const handleAvatarPress = (user:User) => {
        setSelectedUser(user);
        setShowModal(true);
    };

    const sendFocusInvite = (userId: number) => {
        // focus invite logic to implement
        console.log(`Sending focus invite to user ${userId}`);
        setShowModal(false);
    };

    return (
        <ImageBackground
            source={require('../assets/images/background.png')}
            style={styles.background}
        >
            <View style={styles.container}>
                {users.map((user: User) => (
                    <TouchableOpacity
                        key={user.id}
                        style={[styles.avatar, {
                            left: user.position.left,
                            top: user.position.top
                        }]}
                        onPress={() => handleAvatarPress(user)}
                    >
                        <Image
                            source={user.avatar}
                            style={styles.avatarImage}
                        />
                    </TouchableOpacity>
                ))}

                <Modal
                    visible={showModal}
                    transparent={true}
                    animationType="fade"
                    onRequestClose={() => setShowModal(false)}
                >
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContent}>
                            {selectedUser && (
                                <>
                                    <Image
                                        source={selectedUser.avatar}
                                        style={styles.modalAvatar}
                                    />
                                    <Text style={styles.userName}>{selectedUser.name}</Text>
                                    <Text style={styles.stats}>
                                        Focus Sessions: {selectedUser.focusSessions}
                                    </Text>
                                    <TouchableOpacity
                                        style={styles.inviteButton}
                                        onPress={() => sendFocusInvite(selectedUser.id)}
                                    >
                                        <Text style={styles.inviteButtonText}>
                                            Send Focus Invite
                                        </Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={styles.closeButton}
                                        onPress={() => setShowModal(false)}
                                    >
                                        <Text style={styles.closeButtonText}>Close</Text>
                                    </TouchableOpacity>
                                </>
                            )}
                        </View>
                    </View>
                </Modal>

                 
                <TouchableOpacity
                    style={styles.stoneButton}
                    onPress={() => navigation.navigate('userProfile')}
                >
                    <Image
                        source={require('../assets/images/stone.png')}
                        style={styles.stoneImage}
                    />
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.saplingButton}
                    onPress={() => navigation.navigate('avatarMarketplace')}
                >
                    <Image
                        source={require('../assets/images/sapling.png')}
                        style={styles.saplingImage}
                    />
                </TouchableOpacity>             


            </View>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    background: {
        flex: 1,
        width: '100%',
        height: '100%',
    },
    container: {
        flex: 1,
        position: 'relative',
    },
    avatar: {
        position: 'absolute',
        width: 80,
        height: 80,
    },
    avatarImage: {
        width: '100%',
        height: '100%',
    
        borderColor: 'rgba(255, 255, 255, 0)',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 15,
        alignItems: 'center',
        width: '80%',
    },
    modalAvatar: {
        width: 120,
        height: 120,
        borderRadius: 60,
        marginBottom: 15,
    },
    userName: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    stats: {
        fontSize: 16,
        marginBottom: 20,
        color: '#666',
    },
    inviteButton: {
        backgroundColor: '#007AFF',
        padding: 15,
        borderRadius: 10,
        width: '100%',
        alignItems: 'center',
        marginBottom: 10,
    },
    inviteButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
    closeButton: {
        padding: 10,
    },
    closeButtonText: {
        color: '#666',
        fontSize: 14,
    },

    stoneButton: {
        position: 'absolute',
        right: 20,
        bottom: 30,
        width: 64,
        height: 64,
        borderRadius: 32,
        overflow: 'hidden',
        elevation: 6, 
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        backgroundColor: 'transparent',
        alignItems: 'center',
        justifyContent: 'center',
    },
    stoneImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    saplingButton: {
        position: 'absolute',
        left: 20,
        bottom: 30,
        width: 64,
        height: 64,
        borderRadius: 32,
        overflow: 'hidden',
        elevation: 6,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        backgroundColor: 'transparent',
        alignItems: 'center',
        justifyContent: 'center',
    },
    saplingImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
});