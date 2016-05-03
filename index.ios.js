/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

/*************************************************
*        IMPLEMENTING 8-PUZZLE IN REACT NATIVE   *
*                                                *   
***************************************************/

/*
    It is not possible to solve an instance of 8 puzzle if number of inversions is odd in the input state. 
    In the examples given in above figure, the first example has 10 inversions, therefore solvable. 
    The second example has 11 inversions, therefore unsolvable.
    
    Go through for more details : http://www.sitepoint.com/randomizing-sliding-puzzle-tiles/
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

// LENGTH OF THIS IS EQUAL TO THE GRID SIZE
var arr = [0, 1, 2] 
var keys = 0;
class AwesomeProject extends Component {
  constructor(props){
    super(props)
    this.state = {
        state: 'view', // VIEW is when picture is visible, PLAY when game starts
        emptyRow: 0,   // the empty element coordinates
        emptyCol: 0,
        urls:[
          ['', require('./images/i01.jpeg'), require('./images/i02.jpeg')],
          [require('./images/i10.jpeg'), require('./images/i11.jpeg'), require('./images/i12.jpeg')],
          [require('./images/i20.jpeg'), require('./images/i21.jpeg'), require('./images/i22.jpeg')],
        ],
        correct_answer: [
          ['', require('./images/i01.jpeg'), require('./images/i02.jpeg')],
          [require('./images/i10.jpeg'), require('./images/i11.jpeg'), require('./images/i12.jpeg')],
          [require('./images/i20.jpeg'), require('./images/i21.jpeg'), require('./images/i22.jpeg')],
        ],
        progress: .05,
    }
  }

  /*Randomize the blocks in the begining of the game*/
  randomize() {  
    let urls = this.state.urls
    var mapping =[ 
        [0,1,2],
        [3,4,5],
        [6,7,8],
    ]
    
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
        
        temp =mapping[i][j]
        mapping[i][j] =mapping[a][b]
        mapping[a][b] = temp
      
        }
    }
    
    if (this.checkInversions(mapping) %2 !== 0) {
        // for 3X3 puzzle, in case of odd number of inversions , no solution exists
        // Hence reducing one inversion

        // swap the last two tiles
        temp =mapping[2][1]
        mapping[2][1] =mapping[2][2]
        mapping[2][2] = temp
        
        temp =urls[2][1]
        urls[2][1] =urls[2][2]
        urls[2][2] = temp
        
    }
    console.log("The inversions are   : ", this.checkInversions(mapping))
    this.setState({urls : urls})
  }
  
  checkInversions(array) {
      let temp = [], inversions = 0;
      for (var i = 0; i < array.length; i++){
          for (var j = 0; j < array[i].length; j++) {
              temp.push(array[i][j])
          }
      }
      
      for (var i = 0; i < temp.length; i++) {
          for (var j = i+1; j < temp.length; j++) {
              if (temp[i] > temp[j])
                inversions++
          }
      }
      console.log("Number of inversions are ", inversions)
      return inversions
  }

  componentDidMount() {
    // Mount the progress bar and keep on increasing it   
    let progress = this.state.progress
    setInterval(function(){
      let progress = this.state.progress
      progress = progress + .005
      this.setState({progress : progress})
    }.bind(this), 100)

    // randomize the picture gallery
    this.randomize()

    // remove the picture and enable playing after 3 seconds
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
      // swap the urls of those two
      let urls = this.state.urls
      let temp = urls[x][y]
      urls[x][y] = urls[this.state.emptyRow][this.state.emptyCol]
      urls[this.state.emptyRow][this.state.emptyCol] = temp

      
      var flag = 0;
      for (var i = 0; i < urls.length; i++) {
          for (var j = 0; j < urls[i].length; j++) {
              if ( !(urls[i][j] === this.state.correct_answer[i][j]) ) {
                  flag = 1;
                  break;
              }
              
          }
      }
      if (flag === 0) {
          alert("Correct Answer !")
      }
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
          <View style = {{flexDirection: 'row'}} key = {index}>
          {
            arr.map(function(col, index){++keys
              return(
                <TouchableOpacity key = {(index + 5)*1000} 
                    onPress={this.clickMe.bind(this, row, col)}  >
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
