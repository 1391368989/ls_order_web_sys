import React, { Component } from 'react';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import SetMenu from './SetMenu'
import AddMenu from './AddMenu'
import { connect } from 'dva';
import {
  Tree,
  Card,
  Form,
  Tabs,
  Modal
} from 'antd';
import styles from './style.less';

const FormItem = Form.Item;
const TreeNode = Tree.TreeNode;
const TabPane = Tabs.TabPane;
@Form.create()
@connect(({ menu, loading }) => ({
  menu,
  loading: loading.models.menu,
}))
export default class SetUpPowerTree extends Component {
  state = {
    autoExpandParent: true,
    node:null,
    selectedKeys:null,
    visible:false,
  };
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'menu/fetchTree'
    });
  }
  onExpand = (expandedKeys) => {
    // if not set autoExpandParent to false, if children expanded, parent can not collapse.
    // or, you can remove all expanded children keys.
    this.setState({
      expandedKeys,
      autoExpandParent: false,
    });
  };
  onSelect = (selectedKeys, info) => {
    setTimeout(()=>{
      this.setState({ node:null });
    },300);
    if(this.state.node&&this.state.node === this.state.selectedKeys){
        this.showModel();
    }
    this.setState({ selectedKeys,node:selectedKeys });
  };
  renderPowerMenu(){
    const { menu } = this.props;
    const {menuList} = menu;
    return (
      <Tree
        defaultExpandAll
        showLine
        onExpand={this.onExpand}
        onSelect={this.onSelect}
      >
        {this.renderTreeNodes(menuList)}
      </Tree>
    );
  };
  renderTreeNodes = (data) => {
    return data.map((item) => {
      if (item.menuVOS === null) item.menuVOS = [];
      if (item.menuVOS) {
        return (
          <TreeNode title={item.name} key={item.id} dataRef={item}>
            {this.renderTreeNodes(item.menuVOS)}
          </TreeNode>
        );
      }
      return <TreeNode {...item} />;
    });
  };
  showModel(){
    this.setState({
      visible:true,
    })
  };
  handleOk =()=>{
    this.setState({
      visible:false,
    })
  };
  handleCancel  =()=>{
    this.setState({
      visible:false,
    })
  };
  renderModalContent (){
    return(
      <div>
        <Tabs type="card">
          <TabPane tab="编辑当前菜单项" key="1">
            <SetMenu/>
          </TabPane>
          <TabPane tab="新增子项" key="2">
            <AddMenu/>
          </TabPane>
        </Tabs>,
      </div>
    )
  };
  render() {
    const { form, dispatch, submitting ,menu } = this.props;
    const { getFieldDecorator, validateFieldsAndScroll, getFieldsError } = form;
    return (
      <PageHeaderLayout title="菜单设置">
        <Card title="菜单配置" style={{marginTop:34}}>
          {this.renderPowerMenu()}
        </Card>
        <Modal
          title="菜单编辑"
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          destroyOnClose ={true}
          width={'800px'}
        >
          {this.state.visible&&this.renderModalContent()}
        </Modal>
      </PageHeaderLayout>
    )
  }
}

