import React, { useState, useEffect } from 'react';
import { ScrollView, View, Text, TouchableOpacity, StyleSheet, ImageBackground } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { db } from './firebase';
import { auth } from './firebase';
import { useIsFocused } from "@react-navigation/native";
import { HeaderBackButton } from '@react-navigation/elements'
import firebase from "firebase/app";
import 'firebase/firestore';

const TestMe = () => {
  const route = useRoute();
  const quizQuestionsDB = db.collection('quizQuestions');
  const navigation = useNavigation();
  const isVisible = useIsFocused();
  const [screenTime, setscreenTime] = useState();

  const handleBackButton = () => {
    navigation.goBack();
    updateScreenTimeInFirestore();
  }

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (<HeaderBackButton onPress={() => handleBackButton()} tintColor='white'></HeaderBackButton>)
    })
  })

  useEffect(() => {
    var secCounter = 0;

    var secInterval = setInterval(() => {
      if (!isVisible) {
        clearInterval(secInterval)
        updateScreenTimeInFirestore();
      }
      else {
        secCounter++;
        setscreenTime(secCounter);
      }

    }, 1000)


    return () => clearInterval(secInterval);
  }, [isVisible]);

  const updateScreenTimeInFirestore = async () => {
    try {
      const user = firebase.auth().currentUser;
      if (user) {
        const userId = user.uid;
        const screenTimeRef = firebase.firestore().collection('screenTimesQuiz').doc(userId);
        const dataDB = db.collection('preferences');
        const querySnapshot = await dataDB.where('uid', '==', userId).get();
        const savedP = querySnapshot.docs[0].data();

        // Fetch the current total screen time from Firestore
        const doc = await screenTimeRef.get();
        const currentScreenTime = await doc.exists ? doc.data().totalScreenTime || 0 : 0;

        // Update the total screen time in Firestore
        if (screenTime > 0 && savedP.optionSaved === true) {
          screenTimeRef.set({
            screen: 'Quiz',
            totalScreenTime: currentScreenTime + screenTime,
          }, { merge: true });
        }
      }
    } catch (error) {
      console.error('Error updating screen time in Firestore:', error);
    }
  };

  const QuizScreen = ({ questions }) => {
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [score, setScore] = useState(0);
    const [showScore, setShowScore] = useState(false);
    const [showAllScore, setshowAllScore] = useState(false);
    const [showAnswer, setShowAnswer] = useState(false);
    const [selectColor, setSelectColor] = useState(null);
    const [disable, setDisable] = useState(null);
    const [maxScore, setmaxScore] = useState(0);

    const [scores, setScores] = useState({
      Impersonation: 0,
      Eavesdropping: 0,
      ShoulderSurfing: 0,
      DumpsterDiving: 0,
      Tailgating: 0,
      Baiting: 0,
      Smishing: 0,
      Vishing: 0,
      Whaling: 0,
      SpearPhishing: 0,
      Pretexting: 0,
    });

    const dataDB = db.collection('scores');


    const insertData = async (datas) => {
      try {
        for (const data of datas) {
          const querySnapshot = await dataDB.where('userid', '==', data.userid).where('quizName', '==', data.quizName).get();
          if (querySnapshot.empty) {
            const docRef = await dataDB.add(data);
            console.log('Data saved with ID:', docRef.id);
          } else {
            console.log('Data already exists:', data);
          }
        }
      } catch (error) {
        console.error('Error saving data:', error);
      }
    };

    const updateScores = async (userId, quizName, newScore) => {
      try {
        const querySnapshot = await dataDB.where('userid', '==', userId).where('quizName', '==', quizName).get();
        if (!querySnapshot.empty) {
          const docRef = querySnapshot.docs[0].ref;
          const docData = querySnapshot.docs[0].data();
          if (newScore > docData.scores) {
            await docRef.update({ scores: newScore });
            setmaxScore(newScore);
            console.log('Scores updated successfully.');
          }
          else {
            setmaxScore(docData.scores);
            console.log('New score is not higher than the stored score.');
          }
        } else {
          console.log('No document found with the specified userId and quizName.');
        }
      } catch (error) {
        console.error('Error updating scores:', error);
      }
    };

    const handleAnswer = (selectedOption) => {
      if (selectedOption === questions[currentQuestion].correctAnswer) {
        setScore(score + 1); 
        setSelectColor(selectedOption); 
        setShowAnswer(true); 
        setDisable(selectedOption); 

        if (route.params.name === 'allQuizzes') {
          switch (questions[currentQuestion].type) {
            case 'Impersonation':
              setScores(prevScores => ({ ...prevScores, Impersonation: prevScores.Impersonation + 1 }));
              break;
            case 'Eavesdropping':
              setScores(prevScores => ({ ...prevScores, Eavesdropping: prevScores.Eavesdropping + 1 }));
              break;
            case 'Shoulder Surfing':
              setScores(prevScores => ({ ...prevScores, ShoulderSurfing: prevScores.ShoulderSurfing + 1 }));
              break;
            case 'Dumpster Diving':
              setScores(prevScores => ({ ...prevScores, DumpsterDiving: prevScores.DumpsterDiving + 1 }));
              break;
            case 'Tailgating':
              setScores(prevScores => ({ ...prevScores, Tailgating: prevScores.Tailgating + 1 }));
              break;
            case 'Baiting':
              setScores(prevScores => ({ ...prevScores, Baiting: prevScores.Baiting + 1 }));
              break;
            case 'Smishing':
              setScores(prevScores => ({ ...prevScores, Smishing: prevScores.Smishing + 1 }));
              break;
            case 'Vishing':
              setScores(prevScores => ({ ...prevScores, Vishing: prevScores.Vishing + 1 }));
              break;
            case 'Whaling':
              setScores(prevScores => ({ ...prevScores, Whaling: prevScores.Whaling + 1 }));
              break;
            case 'Spear Phishing':
              setScores(prevScores => ({ ...prevScores, SpearPhishing: prevScores.SpearPhishing + 1 }));
              break;
            case 'Pretexting':
              setScores(prevScores => ({ ...prevScores, Pretexting: prevScores.Pretexting + 1 }));
              break;
            default:
              break;
          }
        }

      }
      else {
        setSelectColor(selectedOption); 
        setDisable(selectedOption); 
        setShowAnswer(true); 
      }
    }

    const nextQuestion = () => {
      const nQuest = currentQuestion + 1;
      if (nQuest < questions.length) {
        setCurrentQuestion(nQuest); 
        setDisable(null); 
        setShowAnswer(false); 
        setSelectColor(null); 
      }
      else {
        if (route.params.name === 'allQuizzes') {
          setshowAllScore(true);
          const scores = [
            {
              scores: score,
              userid: auth.currentUser.uid,
              quizName: route.params.name
            }
          ]
          insertData(scores);
          updateScores(auth.currentUser.uid, route.params.name, score)
        }
        else {
          setShowScore(true); 

          const scores = [
            {
              scores: score,
              userid: auth.currentUser.uid,
              quizName: route.params.name
            }
          ]
          insertData(scores);
          updateScores(auth.currentUser.uid, route.params.name, score)
        }

      }
    };

    const getOptionBackgroundColor = (selectedOption) => {
      const isSelected = selectColor === selectedOption;
      const isCorrect = selectedOption === questions[currentQuestion].correctAnswer;

      if (isSelected) {
        return isCorrect ? 'green' : 'red';
      } else {
        return 'rgba(255,255,255,.10)';
      }
    };

    const breakdownViews = [
      { category: 'Impersonation score: ', scoreType: 'Impersonation' },
      { category: 'Eavesdropping Score: ', scoreType: 'Eavesdropping' },
      { category: 'Shoulder Surfing Score: ', scoreType: 'ShoulderSurfing' },
      { category: 'Dumpster Diving Score: ', scoreType: 'DumpsterDiving' },
      { category: 'Tailgating Score: ', scoreType: 'Tailgating' },
      { category: 'Baiting Score: ', scoreType: 'Baiting' },
      { category: 'Smishing Score: ', scoreType: 'Smishing' },
      { category: 'Vishing Score: ', scoreType: 'Vishing' },
      { category: 'Whaling Score: ', scoreType: 'Whaling' },
      { category: 'Spear Phishing Score: ', scoreType: 'SpearPhishing' },
      { category: 'Pretexting Score: ', scoreType: 'Pretexting' },
    ]

    return (
      <View style={styles.overlay}>
        <ScrollView contentContainerStyle={{ flexGrow: 1, flexDirection: 'column', }}>
          <Text style={styles.questionStyle}>{questions[currentQuestion].question}</Text>
          {questions[currentQuestion].options.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={{ padding: 10, marginTop: 10, backgroundColor: getOptionBackgroundColor(option), width: 400, alignItems: 'center' }}
              onPress={() => handleAnswer(option)} disabled={disable !== null}>
              <Text style={styles.optionStyle}>{option}</Text>
            </TouchableOpacity>
          ))}
          {showAnswer && (<Text style={styles.correctAnswerStyle}>Correct Answer: {questions[currentQuestion].correctAnswer} {'\n\n'}Reason: {questions[currentQuestion].reason}</Text>
          )}
          <View style={{ flex: 1, justifyContent: 'flex-end', alignSelf: 'center', margin: 50 }}>
            <View style={{}}>
              <TouchableOpacity
                style={[styles.buttonStyle,]}
                onPress={() => nextQuestion()}
              ><Text style={styles.buttonText}>Next</Text></TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }

  const getQuizQuestions = async () => {
    try {
      const snapshot = await quizQuestionsDB.get();
      const questions = [];

      snapshot.forEach((doc) => {
        const questionData = doc.data();
        questions.push(questionData);
      });

      return questions;
    } catch (error) {
      console.error('Error retrieving quiz questions:', error);
      return [];
    }
  };

  const fetchQuestions = async () => {
    const questions = await getQuizQuestions();
    const q1 = questions.filter((question) => question.type === 'Impersonation');
    const q2 = questions.filter((question) => question.type === 'Eavesdropping');
    const q3 = questions.filter((question) => question.type === 'Shoulder Surfing');
    const q4 = questions.filter((question) => question.type === 'Dumpster Diving');
    const q5 = questions.filter((question) => question.type === 'Tailgating');
    const q6 = questions.filter((question) => question.type === 'Baiting');
    const q7 = questions.filter((question) => question.type === 'Smishing');
    const q8 = questions.filter((question) => question.type === 'Vishing');
    const q9 = questions.filter((question) => question.type === 'Whaling');
    const q10 = questions.filter((question) => question.type === 'Spear Phishing');
    const q11 = questions.filter((question) => question.type === 'Pretexting');
    switch (route.params.name) {
      case 'Impersonation':
        setSelectedComponent(<QuizScreen questions={q1} />);
        break;
      case 'Eavesdropping':
        setSelectedComponent(<QuizScreen questions={q2} />);
        break;
      case 'Shoulder Surfing':
        setSelectedComponent(<QuizScreen questions={q3} />);
        break;
      case 'Dumpster Diving':
        setSelectedComponent(<QuizScreen questions={q4} />);
        break;
      case 'Tailgating/Piggybacking':
        setSelectedComponent(<QuizScreen questions={q5} />);
        break;
      case 'Baiting':
        setSelectedComponent(<QuizScreen questions={q6} />);
        break;
      case 'Smishing':
        setSelectedComponent(<QuizScreen questions={q7} />);
        break;
      case 'Vishing':
        setSelectedComponent(<QuizScreen questions={q8} />);
        break;
      case 'Whaling':
        setSelectedComponent(<QuizScreen questions={q9} />);
        break;
      case 'spearPhishing':
        setSelectedComponent(<QuizScreen questions={q10} />);
        break;
      case 'Pretexting':
        setSelectedComponent(<QuizScreen questions={q11} />);
        break;
      case 'allQuizzes':
        setSelectedComponent(<QuizScreen questions={questions} />)
        break;
      default:
        return (
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <ScrollView style={styles.listArea}></ScrollView>
          </View>
        );
    }
  };
  useEffect(() => {
    fetchQuestions();
  }, []);

  const [selectedComponent, setSelectedComponent] = useState(null);

  return (
    <ImageBackground source={require('./assets/Cybersecuritytestme.jpg')} style={{ flex: 1 }}>
      <ScrollView style={styles.container}>
        {selectedComponent}
      </ScrollView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 22,
  },
  questionStyle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 10,
    marginLeft: 10,
    marginRight: 10,
    textAlign: 'center',
    color: 'white'
  },
  optionStyle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'yellow'

  },
  buttonStyle: {
    backgroundColor: 'black',
    padding: 10,
    width: 150,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    borderRadius: 5,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    
  },
  correctAnswerStyle: {
    fontSize: 15,
    textAlign: 'center',
    fontWeight: 'bold',
    marginTop: 10,
    marginLeft: 10,
    marginRight: 10,
    color: 'yellow',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleView: {
    marginTop: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#36485f'
  },
  titleStyle: {
    fontSize: 30,
    color: 'white',
    padding: 20,
  },
});

export default TestMe;