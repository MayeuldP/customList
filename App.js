import React from 'react';
import { StyleSheet, Text, View, Image, ListView, TouchableNativeFeedback, Alert } from 'react-native';
import moment from 'moment';
import 'moment/locale/fr';

var REQUEST_URL = "https://api.lendix.com/projects";
var france = './flags/french.png';
var espagne = './flags/spain.png';

export default class App extends React.Component {
   
   constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      uri:'',
      dataSource: new ListView.DataSource({
		  rowHasChanged: (row1, row2) => row1 !== row2,}), 
    }
      this._onPressButton = this._onPressButton.bind(this);

  }

  componentDidMount() {
      fetch(REQUEST_URL, {
      method: 'GET',
      mode: "no-cors",
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    }).then((response) => response.json())
      .then((responseJson) => {
        this.setState({
          dataSource: this.state.dataSource.cloneWithRows(responseJson.projects),
          isLoading: false,
          hexa : 'black'
      });
        return responseJson;
      });
    }



  renderRowProject(projects)
  {
    var formattedDate = new Date(projects.onlineDate);
    moment().locale('fr');
    moment().format("Do MMMM");
    var newDate =  moment(formattedDate).format('DD MMMM');
    var endDate = moment(new Date(projects.expirationDate)).format('DD MMMM');

    var flag;
    switch(projects.business.address.country)
    {
      case 'fr':
        flag =  require('./flags/french.png');
        break;
      case 'es':
        flag =  require('./flags/spain.png');
        break;
      default:
        flag =  require('./flags/french.png'); /*Par défaut, on mettra francais, car aucun drapeau italien*/
        break; 
    }
    var grade_color;
    var border_width;
    switch (projects.grade)
    {
      case 'A+':
        grade_color = '#78e08f';
        back_color = '#f5f6fa';
        break;
      case 'A':
        grade_color = '#78e08f';
        back_color = '#78e08f';
        break;
      case 'B':
        grade_color = '#f6b93b';
        back_color = '#f6b93b';        
        break;
      case 'B+':
        grade_color = '#f6b93b';
        back_color = '#f5f6fa';        
        break;      
      case 'C':
        grade_color = '#e55039';
        back_color = '#e55039';              
        break;
      case 'C+':
        grade_color = '#e55039'
        back_color = '#f5f6fa';        
    }

    return (
        <TouchableNativeFeedback
        onPress={() => this._onPressButton(projects, endDate)}
        background={TouchableNativeFeedback.SelectableBackground()}>
        <View  style={styles.rowMainView}>
            <View style={styles.illustration}>
              <Image
                style={styles.square}
                source={{uri: 'https://cdn.lendix.com/' + projects.illustration.url}}
              />

              <Image
                style={styles.flag}
                source={flag}
              />
            </View>
            
            <View style={styles.elemBlistView}>
              <Text numberOfLines={1} style={styles.textTitle}>
                {projects.name}
              </Text>
              <Text  style={styles.text}>
                {projects.rate} % sur {projects.loanDuration} mois
              </Text>
              <Text style={{opacity:.54}}>{newDate}</Text>
            </View>

            <View style={styles.elemClistView}>
                <View style={{  borderColor: grade_color,
                                borderWidth: 2, width: 10, height: 10, borderRadius:10, marginTop:5, marginRight:5, backgroundColor: back_color}} />
                <Text style={{color: grade_color}}>{projects.grade}</Text>
            </View>
        </View >
            </TouchableNativeFeedback>

    );
  }

  _onPressButton(projects, endDate)
  {
      Alert.alert(projects.name, projects.summary.fr[0].value + "\n\nMontant demandé : " + 
      projects.amount + " €\n\nFin du projet : " + endDate + " \n\nStatut : " + projects.status, 
      [{text: 'OK', onPress: () => console.log('Ok pressé')}],); 
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={{fontSize:20, paddingTop:40, paddingBottom:10, paddingLeft:10}}>Projets</Text>
         <ListView
                dataSource={this.state.dataSource}
                renderRow={this.renderRowProject.bind(this)}/>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F1F5F8',
  },
  rowMainView: {
    flexDirection: 'row',
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    marginTop:10,
    marginBottom:10,
    marginLeft:30,
    marginRight:30,
    paddingRight:5,
    paddingLeft:5,
    justifyContent:'space-between'
  },
  illustration:{
    flexDirection: 'column',
  },
  square: {
    width: 100,
    position:'absolute',
    borderRadius: 10,
    height: 70,
    marginBottom:20,
    marginLeft:10,
    marginTop:20
},
flag: {
    borderRadius: 1,
    marginTop:85,
    marginLeft:50,
},
circle: {
    borderColor: '#d6d7da',
    borderRadius: 14,
    borderWidth: 15,
    backgroundColor : '#F1F5F8',
    marginTop:85,
    marginLeft:50,
},
	elemBlistView: {
    width:150,
    paddingBottom:20,
    paddingLeft:25,
    paddingTop:20,
		},
  elemClistView: {
      flexDirection: 'row',
      paddingTop:40,
      paddingBottom:20,
  },
  textTitle: {
    flex:1,
    fontWeight: 'bold',
    textAlign:'left'
  },
  text: {
    flex:1,
    textAlign:'left'
  },
  textC: {
    textAlign: 'right'
    }
});
