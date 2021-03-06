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
  ProgressViewIOS,
  Animated,
  Dimensions,
  PanResponder
} from 'react-native';

/*An Array of size N, where grid is of size N X N*/
var arr = [0, 1, 2]

/* Constants for Layout and Positioning of Images*/
var WIDTH = 120
var HEIGHT = 60
var TOP = 10
var LEFT = 30

/*React Class which contains code*/
class AwesomeProject extends Component {
  constructor(props){
    super(props)
    this.state = {
        state: 'view',
        empty : 0,
        emptyRow: 5,
        emptyCol: 5,
        urls:[
          ['', require('./images/i01.jpeg'), require('./images/i02.jpeg')],
          [require('./images/i10.jpeg'), require('./images/i11.jpeg'), require('./images/i12.jpeg')],
          [require('./images/i20.jpeg'), require('./images/i21.jpeg'), require('./images/i22.jpeg')],
        ],
        progress: .1,
        text: 'None',
        pan : [
          [new Animated.ValueXY(), new Animated.ValueXY(), new Animated.ValueXY()],
          [new Animated.ValueXY(), new Animated.ValueXY(), new Animated.ValueXY()],
          [new Animated.ValueXY(), new Animated.ValueXY(), new Animated.ValueXY()]
              ]
    }
    this.panResponder = new Array(new Array(3), new Array(3), new Array(3))
    for (var i = 0; i < 3; i++) {
      for (var j = 0; j < 3; j++){
        var a = i, b = j;
        this.panResponder[i][j] = PanResponder.create({    //Step 2
          // Initialize the pan responder
          onStartShouldSetPanResponder: (evt, gestureState) => true,
          onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
          onMoveShouldSetPanResponder: (evt, gestureState) => true,
          onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,

          onPanResponderGrant: (evt, gestureState) => {
          // The guesture has started. Show visual feedback so the user knows what is happening!
          // gestureState.{x,y}0 will be set to zero now, These are the coordinates of where user has touched
          console.log("i,j are ", i, j)
          this.refs['img' + i + j].setNativeProps({
            opacity : .5
          })
          this.setState({text : 'Registered touch at coordinates ' + gestureState.x0 + ' & ' + gestureState.y0})

          },

          /* These are the coordinates relative to the point where touch occured */
          //this.setState({text : 'Current position is  ' + gestureState.dx + ' & ' + gestureState.dy})
          onPanResponderMove: Animated.event([null,{
              dx : this.state.pan[a][b].x,
              dy : this.state.pan[a][b].y,
          }]),

          onPanResponderRelease: (evt, gestureState)=> {

        }
    });
    }}
  }
  componentWillUnmount() {
    this.state.pan.x.removeAllListeners();
    this.state.pan.y.removeAllListeners();
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

    if (Math.abs(x - this.state.emptyRow) + Math.abs(y - this.state.emptyCol) === 1) {

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
        <Text>3 X 3 Grid : {this.state.text} {this.state.pan[0].x ? this.state.pan[0].x._value : null}</Text>
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

                  <Animated.Image
                    {...this.panResponder[row][col].panHandlers}
                    ref = {'img' + row + col}
                    style={{position: 'absolute', top : row === 0 ? TOP : row === 1 ? TOP + HEIGHT : TOP + 2*HEIGHT , left : col === 0 ? LEFT : col === 1 ? LEFT + WIDTH: LEFT + 2*WIDTH, borderWidth : .4, opacity:1, height:HEIGHT, width:WIDTH,}}
                    source={this.state.emptyRow === row && this.state.emptyCol === col ? null : this.state.urls[row][col] }
                  />

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
    marginTop : 35,
//    alignItems: 'center',
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
  mainImage: {
    borderWidth : .4,
    opacity:1,
    height:180,
    width:360,
  },
});

AppRegistry.registerComponent('AwesomeProject', () => AwesomeProject);
