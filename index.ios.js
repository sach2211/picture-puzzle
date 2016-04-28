/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, {
  AppRegistry,
  Component,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  ProgressViewIOS
} from 'react-native';


var arr = [0, 1, 2] 
class AwesomeProject extends Component {
  constructor(props){
    super(props)
    this.state = {
        state: 'view',
        empty : 0,
        emptyRow: 0,
        emptyCol: 0,
        urls:[
          ['', require('./images/i01.jpeg'), require('./images/i02.jpeg')],
          [require('./images/i10.jpeg'), require('./images/i11.jpeg'), require('./images/i12.jpeg')],
          [require('./images/i20.jpeg'), require('./images/i21.jpeg'), require('./images/i22.jpeg')],
        ],
        progress: .1,
    }
  }

  randomize() {
    let urls = this.state.urls
    for (let i = 0; i < urls.length; i++) {
      for (let j = 1; j < urls[i].length; j++) {
        let a = Math.random(), 
            b = Math.random()
        a = (Math.floor(a * 10)) % 3
        b = (Math.floor(b * 10)) % 3
        if (a ===  0 && b === 0)
          continue
        let temp = urls[i][j]
        urls[i][j] = urls[a][b]
        urls[a][b] = temp
      }
    }
    this.setState({urls : urls})
  }

  componentDidMount() {
    let progress = this.state.progress
    setInterval(function(){
      let progress = this.state.progress
      progress = progress + .005
      this.setState({progress : progress})
    }.bind(this), 100)

    this.randomize()

    setTimeout(function(){
      this.setState({state : 'play'})
    }.bind(this), 3000)
  
  }

  clickMe(x, y) {
    let up    = { x : x -1 , y : y }
    let down  = { x : x +1 , y : y -1}
    let left  = { x : x , y : y -1}
    let right = { x : x , y : y + 1}

    if (Math.abs(x - this.state.emptyRow) + Math.abs(y - this.state.emptyCol) === 1) {
     // alert('Move')

      // swap the urls of those two
      let urls = this.state.urls
      let temp = urls[x][y]
      urls[x][y] = urls[this.state.emptyRow][this.state.emptyCol]
      urls[this.state.emptyRow][this.state.emptyCol] = temp

      this.setState({urls : urls, emptyRow : x, emptyCol : y})

    }
  }

  alert() {
    alert('Image load Completeed')
  }
  render() {
    return (

      <View style={styles.container}>
        <Text>3 X 3 Grid : {this.state.emptyRow} {this.state.emptyCol}</Text>
        <ProgressViewIOS
          style={{width : 300, height : 50}}
          progress={this.state.progress}
          progressViewStyle = 'bar'
          progressTintColor={this.state.progress > .25 ? (this.state.progress > .5 ? (this.state.progress > .75 ? '#D9534F' : '#F0AD4E') : '#5CB85C' ) : '#5BC0DE'}
        />

      {this.state.state === 'play' 
        ?(
        arr.map(function(row, index) {
        return(
          <View style = {{flexDirection: 'row'}}>
          {
            arr.map(function(col, index){
              return(
                <TouchableOpacity onPress={this.clickMe.bind(this, row, col)}>
                  <Image
                    style={styles.image}
                    source={this.state.emptyRow === row && this.state.emptyCol === col ? null : this.state.urls[row][col] }
                  />
                </TouchableOpacity>    
              )
            }, this)
          }
          </View>
        )}, this)
        )
        :(
          <View>
        <Image
        style={styles.mainImage}
        source={require('./images/puma.jpg')}
      />
      </View>
        )
      }
      </View>
      
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop : 45,
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  button :{
    textAlign: 'center',
    color: 'red',
    backgroundColor : 'blue',
    marginBottom: 7,
    height : 40
  },
  image :{
    borderWidth : .4,
    opacity:1,
    height:60,
    width:120,
  },
  mainImage: {
    borderWidth : .4,
    opacity:1,
    height:180,
    width:360,
  },
});

AppRegistry.registerComponent('AwesomeProject', () => AwesomeProject);