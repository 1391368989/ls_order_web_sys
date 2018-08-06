import React from 'react';
import {Route,Switch} from 'dva/router'
import SowingMap from '../components/Mobile/SowingMap'
import { getRoutes, getPageQuery, getQueryPath } from '../utils/utils';

export default  class MobileLayout extends React.PureComponent{
  render(){
    const { routerData, match } = this.props;
    return(
      <div>
        <div>
          <SowingMap/>
        </div>
        <Switch>
         {getRoutes(match.path, routerData).map(item => (
         <Route
         key={item.key}
         path={item.path}
         component={item.component}
         exact={item.exact}
         />
         ))}
    {/*     <Redirect from="/user" to={getLoginPathWithRedirectPath()} />*/}
         </Switch>
      </div>
    )
  }
}