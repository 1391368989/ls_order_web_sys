import React from 'react';
import {Route,Switch,Redirect} from 'dva/router'
import { getRoutes, getPageQuery, getQueryPath } from '../utils/utils';


export default  class MobileLayout extends React.PureComponent{
  render(){
    const { routerData, match } = this.props;
    return(
      <div>
        <Switch>
         {getRoutes(match.path, routerData).map(item => (
         <Route
         key={item.key}
         path={item.path}
         component={item.component}
         exact={item.exact}
         />
         ))}
         <Redirect from="/phone" to='/phone/info' />
         </Switch>
      </div>
    )
  }
}
