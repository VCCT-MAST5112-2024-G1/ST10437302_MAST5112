import React, { useState, useEffect, useCallback } from 'react';
import { 
    View, 
    Text, 
    FlatList, 
    TouchableOpacity, 
    StyleSheet, 
    ImageBackground, 
    Alert 
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';

type RootStackParamList = {
    MenuScreen: { filteredItems?: MenuItem[] };
    AddDishScreen: { setMenuItems: React.Dispatch<React.SetStateAction<MenuItem[]>> };
    FilterScreen: undefined;
};

type MenuScreenNavigationProp = StackNavigationProp<RootStackParamList, 'MenuScreen'>;
type MenuScreenRouteProp = RouteProp<RootStackParamList, 'MenuScreen'>;

interface MenuItem {
    name: string;
    description: string;
    course: string;
    price: string;
}

interface MenuScreenProps {
    navigation: MenuScreenNavigationProp;
    route: MenuScreenRouteProp;
}

const MenuScreen: React.FC<MenuScreenProps> = ({ navigation, route }) => {
    const [menuItems, setMenuItems] = useState<MenuItem[]>([]); // Initial menu items state
    const [sortBy, setSortBy] = useState<'name' | 'price'>('name'); // State for sorting

    // Update menu items from filtered results
    useEffect(() => {
        if (route.params?.filteredItems) {
            setMenuItems(route.params.filteredItems);
        }
    }, [route.params?.filteredItems]);

    // Sort menu items dynamically
    const sortedMenuItems = [...menuItems].sort((a, b) => {
        if (sortBy === 'name') {
            return a.name.localeCompare(b.name);
        }
        return parseFloat(a.price) - parseFloat(b.price);
    });

    // Highlight the most expensive dish
    const getMostExpensiveDish = useCallback(() => {
        if (menuItems.length === 0) return null;
        return menuItems.reduce((prev, current) =>
            parseFloat(prev.price) > parseFloat(current.price) ? prev : current
        );
    }, [menuItems]);

    const mostExpensiveDish = getMostExpensiveDish();

    // Navigate to Add Dish Screen
    const addDishHandler = () => {
        navigation.navigate('AddDishScreen', { setMenuItems });
    };

    // Toast-like alert for sorting
    const onSortChange = (sortOption: 'name' | 'price') => {
        setSortBy(sortOption);
        Alert.alert('Sorting Changed', `Sorted by ${sortOption === 'name' ? 'Name' : 'Price'}`);
    };

    // Reusable Card Component
    const renderMenuItem = useCallback(
        ({ item }: { item: MenuItem }) => (
            <View style={styles.card}>
                <Text style={styles.cardTitle}>{item.name}</Text>
                <Text style={styles.cardText}>Course: {item.course}</Text>
                <Text style={styles.cardText}>Price: R{item.price}</Text>
                <Text style={styles.cardDescription}>{item.description}</Text>
            </View>
        ),
        []
    );

    return (
        <ImageBackground source={require('../assets/Background.jpg')} style={styles.backgroundImage}>
            <View style={styles.container}>
                <Text style={styles.title}>Menu Overview</Text>
                <Text style={styles.subtitle}>Total Dishes: {menuItems.length}</Text>
                {mostExpensiveDish && (
                    <Text style={styles.highlight}>
                        Most Expensive Dish: {mostExpensiveDish.name} - R{mostExpensiveDish.price}
                    </Text>
                )}
                <View style={styles.sortContainer}>
                    <Text style={styles.sortLabel}>Sort by:</Text>
                    <TouchableOpacity
                        style={[styles.sortButton, sortBy === 'name' && styles.activeButton]}
                        onPress={() => onSortChange('name')}
                    >
                        <Text style={[styles.sortText, sortBy === 'name' && styles.activeSort]}>
                            Name
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.sortButton, sortBy === 'price' && styles.activeButton]}
                        onPress={() => onSortChange('price')}
                    >
                        <Text style={[styles.sortText, sortBy === 'price' && styles.activeSort]}>
                            Price
                        </Text>
                    </TouchableOpacity>
                </View>
                <FlatList
                    data={sortedMenuItems}
                    keyExtractor={(_, index) => index.toString()}
                    renderItem={renderMenuItem}
                    ListEmptyComponent={<Text style={styles.emptyText}>No menu items available.</Text>}
                />
                <TouchableOpacity onPress={addDishHandler} style={styles.button}>
                    <Text style={styles.buttonText}>Add Dish</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate('FilterScreen')} style={styles.button}>
                    <Text style={styles.buttonText}>Filter</Text>
                </TouchableOpacity>
            </View>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    backgroundImage: {
        flex: 1,
        resizeMode: 'cover',
        justifyContent: 'center',
    },
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: 'rgba(240, 248, 255, 0.9)',
    },
    title: {
        fontSize: 30,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 15,
        color: '#2f4f4f',
    },
    subtitle: {
        fontSize: 18,
        textAlign: 'center',
        marginBottom: 10,
        color: '#555',
    },
    highlight: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 20,
        color: '#8b0000',
        fontWeight: 'bold',
    },
    sortContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 10,
    },
    sortLabel: {
        fontSize: 16,
        marginRight: 10,
        color: '#555',
    },
    sortButton: {
        marginHorizontal: 5,
        padding: 10,
    },
    activeButton: {
        backgroundColor: '#e0e0e0',
        borderRadius: 5,
    },
    sortText: {
        fontSize: 16,
        color: '#007bff',
    },
    activeSort: {
        fontWeight: 'bold',
        textDecorationLine: 'underline',
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 15,
        marginVertical: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
    },
    cardTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    cardText: {
        fontSize: 16,
        marginBottom: 5,
    },
    cardDescription: {
        fontSize: 14,
        fontStyle: 'italic',
        color: '#555',
    },
    emptyText: {
        textAlign: 'center',
        fontSize: 16,
        color: '#555',
        marginTop: 20,
    },
    button: {
        backgroundColor: '#20b2aa',
        padding: 15,
        marginTop: 15,
        alignItems: 'center',
        borderRadius: 5,
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
});

export default MenuScreen;
