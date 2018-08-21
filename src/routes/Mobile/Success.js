import React from 'react'
import styles from './index.less'
import {Button} from 'antd'
import { connect } from 'dva';
import SowingMap from '../../components/Mobile/SowingMap'
import appImg from '../../assets/images/appimg.png'
@connect()
export default class Success extends React.PureComponent{
  render(){
    return(
      <div>
        <div>
          <SowingMap/>
        </div>
        <div className={`${styles.pad20} ${styles.mt20} ${styles.textc}` }>
          <div>
            <Button shape="circle" icon="check" type="primary" className={styles.btnSuccess}/>
            <span>恭喜你提交成功，去领取您的佣金吧！</span>
          </div>
          <div>
            <img src={appImg} className={styles.appImg}/>
          </div>
          <p>下载猎手APP，获取更多兼职信息</p>
        </div>
      </div>
    )
  }
}
