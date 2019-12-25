import React from 'react';
import styles from './index.css';
import { ListView } from 'antd-mobile';


const host = 'http://192.168.124.16:3000'
export default class App extends React.Component {
  constructor(props){
    super(props)
    const dataSource = new ListView.DataSource({
      rowHasChanged: (row1, row2) => row1 !== row2,
    });
    this.state = {
      data: [],
      menus: [],
      dataSource,
      isLoading: false,
    }
  }
  componentDidMount() {
    fetch(host + '/api/xiaomi/query').then(response => response.json()).then(res => {
      this.setState({
        data: res.data
      })
    })
    fetch(host + '/story/sjy').then(response => response.json()).then(res => {
      this.setState({
        menus: res.data,
        dataSource: this.state.dataSource.cloneWithRows(res.data)
      })
    })
  }
  onDetail = (href) => {
    window.open(href)
  }
  render() {
    const { data, menus } = this.state
    const separator = (sectionID, rowID) => (
      <div
        key={`${sectionID}-${rowID}`}
        style={{
          backgroundColor: '#F5F5F9',
          height: 8,
          borderTop: '1px solid #ECECED',
          borderBottom: '1px solid #ECECED',
        }}
      />
    );
    let index = data.length - 1;
    const row = (rowData, sectionID, rowID) => {
      if (index < 0) {
        index = data.length - 1;
      }
      const obj = data[index--];
      return (
        <div key={rowID} style={{ padding: '0 15px' }}>
          <div
            style={{
              lineHeight: '50px',
              color: '#888',
              fontSize: 18,
              borderBottom: '1px solid #F6F6F6',
            }}
          >{obj.title}</div>
          <div style={{ display: '-webkit-box', display: 'flex', padding: '15px 0' }}>
            <img style={{ height: '64px', marginRight: '15px' }} src={obj.img} alt="" />
            <div style={{ lineHeight: 1 }}>
              <div style={{ marginBottom: '8px', fontWeight: 'bold' }}>{obj.des}</div>
              <div><span style={{ fontSize: '30px', color: '#FF6E27' }}>{rowID}</span>¥</div>
            </div>
          </div>
        </div>
      );
    }
    return <div>
      <ListView
        ref={el => this.lv = el}
        dataSource={this.state.dataSource}
        renderHeader={() => <span>header</span>}
        renderFooter={() => (<div style={{ padding: 30, textAlign: 'center' }}>
          {this.state.isLoading ? 'Loading...' : 'Loaded'}
        </div>)}
        renderRow={row}
        renderSeparator={separator}
        className="am-list"
        pageSize={4}
        useBodyScroll
        onScroll={() => { console.log('scroll'); }}
        scrollRenderAheadDistance={500}
        onEndReachedThreshold={10}
      />
      {
        menus.map((item: { title: string, href: string }) => {
          return <div onClick={() => this.onDetail(item.href)}>{item.title}</div>
        })
      }
      {data.map((item: { title: string, image: string }) => {
        return <div><span>{item.title}</span><img src={item.image} /></div>
      })}
    </div>
  }
}
