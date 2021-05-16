import React, { Component } from 'react';
import {Text,StyleSheet,View, TouchableOpacity,Alert,BackHandler} from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import TrackPlayer from 'react-native-track-player';
import Toast from 'react-native-simple-toast';

class App extends Component {
  constructor(){
    super();
    this.leftClickHandler=this.leftClickHandler.bind(this);
    this.rightClickHandler=this.rightClickHandler.bind(this);
    this.topClickHandler=this.topClickHandler.bind(this);
    this.bottomClickHandler=this.bottomClickHandler.bind(this);
    this.randomNumberGenerator=this.randomNumberGenerator.bind(this);
    this.snakeTouchBoundery=this.snakeTouchBoundery.bind(this);
    this.gameOver=this.gameOver.bind(this);
    this.playAgain=this.playAgain.bind(this);
    this.setTheInterval=this.setTheInterval.bind(this);
    this.snakeEatRat=this.snakeEatRat.bind(this);
    this.snakeTouchItsBody=this.snakeTouchBoundery.bind(this);
    this.snakeCollideWithItself=this.snakeCollideWithItself.bind(this);
    this.state={
      button:'right',
      snake:[
        [0,0],
        [0,5]
      ],
      rat:this.randomNumberGenerator(),
      speed:300,
      onAlert:true,
      prevousSnakeLength:2
    }
  }
  snakeCollideWithItself(){
    let snake=[...this.state.snake];
    let head=snake[snake.length-1];
    snake.pop();
    snake.forEach(body=>{
     if(head[0]==body[0] && head[1]==body[1]){
       this.gameOver();
       crashSound();
     }
    })
  }
  componentDidMount(){
    this.setTheInterval();
    Toast.show('developed by m@K',5);
  }
  componentDidUpdate(){
    if(this.state.onAlert){
      this.snakeCollideWithItself();
      this.snakeTouchBoundery();
      this.snakeEatRat();
    }
  }
  setTheInterval(){
    if(this.state.onAlert){
      setInterval(() => {
        let snake=[...this.state.snake];
        let head=snake[snake.length-1];
        const direction=this.state.button;
        if(this.state.onAlert){
          if(direction==='right' && direction!='left'){
            head=[head[0],head[1]+5];
          }
          else if(direction==='up'&& direction!='down'){
            head=[head[0]-5,head[1]];
          }
          else if(direction==='left'&& direction!='right'){
            head=[head[0],head[1]-5];
          }
          else if(direction==='down'&& direction!='up'){
            head=[head[0]+5,head[1]];
          }
          snake.push(head);
          snake.shift();
          this.setState({snake:snake})
        }

      }, this.state.speed);
    }
  }
  snakeTouchBoundery(){
    const snake=[...this.state.snake];
    const head=snake[snake.length-1];
    if(head[0]>=100 || head[1]>=100 || head[0]<0 || head[1]<0){
      this.gameOver();
      crashSound();
    }
  }
  snakeEatRat(){
    const snake=[...this.state.snake];
    const head=snake[snake.length-1];
    const rat=this.state.rat;
    if(head[0]==rat[0] && head[1]==rat[1]){
      let x,y;
      if(snake.length===this.state.prevousSnakeLength+10){
        this.setState({
          speed:this.state.speed+50,
          prevousSnakeLength: snake.length
        })
      }
      if(this.state.button==='right'){
        x=head[1];
        y=head[0]+5;
      }
      if(this.state.button==='left'){
        x=head[1];
        y=head[0]-5;
      }
      if(this.state.button==='up'){
        x=head[1]-5;
        y=head[0];
      }
      if(this.state.button==='down'){
        x=head[1]+5;
        y=head[0];
      }
      snake.unshift([x,y]);
      this.setState({
        rat:this.randomNumberGenerator(),
        snake:snake
      })
      eatSound();
    }
  }
  gameOver(){
    this.setState({
      onAlert:false,
    })
    Alert.alert(
      'game over',
      "click ok to play again",
      [
        {
          text: "Exit",
          onPress: () => {BackHandler.exitApp()},
          style: 'cancel'
        },
        { text: "OK", onPress: () => {this.playAgain()} }
      ],
      { cancelable: false },
      );
  }
  playAgain(){
    this.setState({
      onAlert:true,
      button:'right',
      snake:[
        [0,0],
        [0,5]
      ],
      rat:this.randomNumberGenerator(),
    })
  }
  randomNumberGenerator(){
    let x1=Math.floor(Math.random()*100);
    let y1=Math.floor(Math.random()*100);
    let x=Math.round(x1/5)*5;
    let y=Math.round(y1/5)*5;
    if(x>95 || y>95){
      x=95;
      y=95;
    }
    return [x,y];
  }
  leftClickHandler(){
    if(this.state.button!='right')
    this.setState({button:'left'});
  }
  rightClickHandler(){
    if(this.state.button!='left')
    this.setState({button:'right'});
  }
  bottomClickHandler(){
    if(this.state.button!='up')
    this.setState({button:'down'});
  }
  topClickHandler(){
    if(this.state.button!='down')
    this.setState({button:'up'})
  }
  render() { 
    return ( 
      <View style={style.container}>
        <View style={style.header}>
          <Text style={style.score}>score : {this.state.snake.length-2}</Text>
          <Text style={style.score}>speed : {this.state.speed}m/s</Text>
        </View>
        <View style={style.gameArea}>
          <Snake snake={this.state.snake}/>
          <Rat rat={this.state.rat}/>
        </View>
        <View style={style.buttonArea}>
          <View style={style.buttons}>
            <TouchableOpacity style={style.btn1} onPress={this.topClickHandler}>
              <Icon name='upcircle' color='black' size={40}/>
            </TouchableOpacity>
            <View style={style.btn23}>
              <TouchableOpacity style={style.btn2} onPress={this.leftClickHandler}>
                <Icon name='banckward' color='black' size={40}/>
              </TouchableOpacity>
              <TouchableOpacity style={style.btn3} onPress={this.rightClickHandler}>
                <Icon name='forward' color='black' size={40}/>
              </TouchableOpacity>
            </View>
            <TouchableOpacity style={style.btn4} onPress={this.bottomClickHandler}>
              <Icon name='downcircle' color='black' size={40}/>
            </TouchableOpacity>
          </View>
        </View>
      </View>
     );
  }
}
function Snake(props){
  return (
    <View style={{width:'100%',height:'100%'}}>
      {
        props.snake.map((body,index)=>{
          const mystyle={
            top:`${body[0]}%`,
            left:`${body[1]}%`
          }
          return (
            <View key={index} style={{...style.snakeBody,...mystyle}}></View>
          )
        })
      }
    </View>
  )
}
function Rat(props){
  const mystyle={
    top:`${props.rat[0]}%`,
    left:`${props.rat[1]}%`
  }
  return (
    <View style={{...style.rat,...mystyle}}></View>
  )
}

const style=StyleSheet.create({
  container:{
    flex:1,
    backgroundColor:'#ddd'
  },
  header:{
    flex:1,
    backgroundColor:'#333',
    flexDirection:'row',
    justifyContent:'space-between',
    padding:2,
    margin:2
  },
  gameArea:{
    flex:5,
    backgroundColor:'#2875a6',
    margin:2
  },
  buttonArea:{
    flex:3,
    justifyContent:'center',
    alignItems:'center',
  },
  buttons:{
    borderColor:'#333',
    width:'80%',
    height:'95%',
    borderWidth:2,
    borderRadius:100
  },
  btn23:{
    flexDirection:'row',
    width:'100%',
    height:'30%',
  },
  btn1:{
    backgroundColor:'#2875a6',
    alignItems:'center',
    justifyContent:'center',
    width:'40%',
    height:'35%',
    left:'30%',
    borderRadius:100,
    borderWidth:4,
  },
  btn2:{
    backgroundColor:'#2875a6',
    alignItems:'center',
    justifyContent:'center',
    width:'40%',
    marginRight:'20%',
    borderRadius:100,
    borderWidth:4,
  },
  btn3:{
    backgroundColor:'#2875a6',
    alignItems:'center',
    justifyContent:'center',
    width:'40%',
    borderRadius:100,
    borderWidth:4,
  },
  btn4:{
    backgroundColor:'#2875a6',
    alignItems:'center',
    justifyContent:'center',
    width:'40%',
    height:'35%',
    left:'30%',
    borderRadius:100,
    borderWidth:4,
  },
  score:{
    fontSize:40,
    color:'#fff',
    fontFamily:'Italianno-Regular',

  },
  snakeBody:{
    position:'absolute',
    width:15,
    height:15,
    backgroundColor:'black',
  },
  rat:{
    position:'absolute',
    width:15,
    height:15,
    backgroundColor:'black',
  }
});
const crashSound = async () => {
  await TrackPlayer.setupPlayer();
  await TrackPlayer.add({
      url: require('./android/app/src/main/res/raw/android_app_src_main_res_raw_android_app_src_main_res_raw_assets_fonts_sounds_impacts_crashes.mp3'),
  });
  await TrackPlayer.play();
  TrackPlayer.updateOptions({
    stopWithApp: true
  });
};
const eatSound = async () => {
  await TrackPlayer.setupPlayer();
  await TrackPlayer.add({
      url: require('./assets/fonts/sounds/175837873.mp3'),
  });
  await TrackPlayer.play();
  TrackPlayer.updateOptions({
    stopWithApp: true
  });
};

export default App;