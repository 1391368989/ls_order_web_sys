import React, { Component } from 'react';
import {Carousel } from 'antd';
import styles from './index.less';
import a from '../../assets/images/banner1.jpg'
import b from '../../assets/images/banner2.png'

export default class SowingMap extends Component{
  onChange =(a, b, c)=>{
    console.log(a, b, c);
  }
  render(){
   return(
     <div className={styles.box}>
       <Carousel afterChange={this.onChange} autoplay={true}>
         <div>
           <img src={a}/>
         </div>
         <div>
           <img src={b}/>
         </div>
       </Carousel>
     </div>
   )
  }
}

