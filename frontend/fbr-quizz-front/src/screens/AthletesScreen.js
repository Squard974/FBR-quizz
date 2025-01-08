import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  FlatList,
  Dimensions,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';

const { width, height } = Dimensions.get('window');

const AthletesScreen = ({ route, navigation }) => {
  const { athletes } = route.params;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userGuess, setUserGuess] = useState('');
  const [timers, setTimers] = useState(
    Array(athletes.length).fill(20) // Initialiser un timer de 20 secondes pour chaque athlète
  );
  const [showNames, setShowNames] = useState(
    Array(athletes.length).fill(false) // Gérer la révélation des noms
  );
  const [isGuessed, setIsGuessed] = useState(
    Array(athletes.length).fill(false) // Indique si l'athlète a été deviné
  );
  const [isTimeout, setIsTimeout] = useState(
    Array(athletes.length).fill(false) // Indique si le temps est écoulé sans réponse
  );

  const intervalRef = useRef(null);

  // Gère le timer pour chaque athlète
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setTimers((prevTimers) =>
        prevTimers.map((time, index) =>
          index === currentIndex && time > 0 ? time - 1 : time
        )
      );
    }, 1000);

    return () => clearInterval(intervalRef.current);
  }, [currentIndex]);

  // Révéler le nom lorsque le timer atteint 0
  useEffect(() => {
    if (timers[currentIndex] === 0 && !isGuessed[currentIndex]) {
      // Révéler le nom
      setShowNames((prev) => {
        const updatedShowNames = [...prev];
        updatedShowNames[currentIndex] = true;
        return updatedShowNames;
      });

      // Mettre à jour les états pour indiquer le timeout
      setIsTimeout((prevIsTimeout) => {
        const updatedIsTimeout = [...prevIsTimeout];
        updatedIsTimeout[currentIndex] = true;
        return updatedIsTimeout;
      });

      setIsGuessed((prevIsGuessed) => {
        const updatedIsGuessed = [...prevIsGuessed];
        updatedIsGuessed[currentIndex] = false; // Sportif non deviné
        return updatedIsGuessed;
      });
    }
  }, [timers[currentIndex]]); // Dépend uniquement de timers[currentIndex]

  // Rendu d'un athlète
  const renderAthlete = ({ item, index }) => (
    <View style={[styles.athleteContainer, { width }]}>
      {/* Timer ou statut */}
      {isGuessed[index] ? (
        isTimeout[index] ? (
          <Text style={styles.notGuessedText}>Vous n'avez pas trouvé le sportif !</Text>
        ) : (
          <Text style={styles.guessedText}>Sportif trouvé ! 🎉</Text>
        )
      ) : (
        <Text style={styles.timerText}>
          {timers[index] > 0
            ? `Temps restant : ${timers[index]}s`
            : "Vous n'avez pas trouvé le sportif !"}
        </Text>
      )}

      {/* Photo */}
      <Image
        source={{ uri: item.photo_url }}
        style={styles.athletePhoto}
      />

      {/* Nom révélé ou caché */}
      {showNames[index] ? (
        <Text style={styles.athleteName}>{item.name}</Text>
      ) : (
        <Text style={styles.hiddenName}>Nom caché</Text>
      )}

      {/* Détails */}
      <Text style={styles.athleteDetails}>Nationalité: {item.nationality}</Text>
      <Text style={styles.athleteDetails}>Équipe: {item.team}</Text>
      <Text style={styles.athleteDetails}>Position: {item.position}</Text>
      <Text style={styles.athleteDetails}>Âge: {item.age}</Text>
    </View>
  );

  // Gestion de l'index actuel
  const handleViewableItemsChanged = ({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index);
      setUserGuess('');
    }
  };

  // Vérifie si la tentative est correcte
  const handleGuess = () => {
    const currentAthlete = athletes[currentIndex];

    // Extraction du nom complet et du nom de famille
    const athleteFullName = currentAthlete.name.toLowerCase();
    const athleteLastName = currentAthlete.name.split(' ').slice(-1)[0].toLowerCase();

    // Réponse de l'utilisateur
    const userInput = userGuess.trim().toLowerCase();

    // Validation
    if (userInput === athleteFullName || userInput === athleteLastName) {
      Alert.alert('Bravo !', 'Vous avez trouvé le bon sportif 🎉');
      setShowNames((prevShowNames) => {
        const updatedShowNames = [...prevShowNames];
        updatedShowNames[currentIndex] = true;
        return updatedShowNames;
      });

      setIsGuessed((prevIsGuessed) => {
        const updatedIsGuessed = [...prevIsGuessed];
        updatedIsGuessed[currentIndex] = true;
        return updatedIsGuessed;
      });
    } else {
      Alert.alert('Incorrect', "Ce n'est pas le bon sportif. Réessayez !");
    }

    setUserGuess('');
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.quitButton}
        onPress={() => navigation.navigate('EndGameScreen', {
          athletes: athletes,
          foundAthletes: isGuessed, // Liste des athlètes trouvés ou non
        })}
      >
        <Text style={styles.quitButtonText}>Quitter</Text>
      </TouchableOpacity>

      <FlatList
        data={athletes}
        renderItem={renderAthlete}
        keyExtractor={(item) => item.id.toString()}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={handleViewableItemsChanged}
        viewabilityConfig={{ itemVisiblePercentThreshold: 50 }}
      />

      {/* Indicateur de pagination */}
      <View style={styles.indicatorContainer}>
        {athletes.map((_, index) => (
          <View
            key={index}
            style={[styles.indicator, currentIndex === index && styles.activeIndicator]}
          />
        ))}
      </View>

      {/* Champ pour deviner l'athlète */}
      <View style={styles.guessContainer}>
        <TextInput
          style={[styles.textInput, (isGuessed[currentIndex] || isTimeout[currentIndex]) && styles.disabledInput]} // Désactive le champ si deviné ou temps écoulé
          placeholder={
            isGuessed[currentIndex] || isTimeout[currentIndex]
              ? 'Déjà trouvé ou temps écoulé'
              : "Devinez le nom du sportif"
          }
          value={userGuess}
          onChangeText={setUserGuess}
          editable={!isGuessed[currentIndex] && !isTimeout[currentIndex]} // Rend le champ non éditable si deviné ou timeout
        />
        <TouchableOpacity
          style={[
            styles.guessButton,
            (isGuessed[currentIndex] || timers[currentIndex] === 0) &&
              styles.disabledButton,
          ]} // Désactive le bouton si deviné ou timer atteint 0
          onPress={handleGuess}
          disabled={isGuessed[currentIndex] || timers[currentIndex] === 0} // Désactive l'action
        >
          <Text style={styles.guessButtonText}>
            {isGuessed[currentIndex] || timers[currentIndex] === 0 ? '❌' : 'Valider'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EE6161',
  },
  quitButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    backgroundColor: '#FFD561',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    zIndex: 1,
  },
  quitButtonText: {
    color: 'red',
    fontSize: 16,
    fontWeight: 'bold',
  },
  athleteContainer: {
    width,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  athletePhoto: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 10,
  },
  athleteName: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 10,
    color: '#333',
  },
  hiddenName: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 10,
    color: '#aaa',
  },
  athleteDetails: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 5,
    color: '#555',
  },
  timerText: {
    fontSize: 20,
    color: 'black',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  guessedText: {
    fontSize: 20,
    color: 'green',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  notGuessedText: {
    fontSize: 20,
    color: 'black',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  indicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 20,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ccc',
    marginHorizontal: 4,
  },
  activeIndicator: {
    backgroundColor: '#FFD561',
  },
  guessContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#963939',
    backgroundColor: '#EE6161',
  },
  textInput: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 10,
    marginRight: 10,
    backgroundColor: '#fff',
  },
  disabledInput: {
    backgroundColor: '#f0f0f0',
    borderColor: '#ddd',
  },
  guessButton: {
    backgroundColor: '#FFD561',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  disabledButton: {
    backgroundColor: '#d3d3d3',
  },
  guessButtonText: {
    color: 'black',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default AthletesScreen;
