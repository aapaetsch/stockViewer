// import React, { Component } from 'react';
// import { Card, Row, Col } from 'antd';
// import '../styles/stocklist.css';
//
// export default class StockPosition extends Component {
//     constructor(props){
//         super(props);
//         this.state = {
//
//         }
//         this.colorSwitcher = this.colorSwitcher.bind(this);
//     }
//
//     colorSwitcher(int){
//         const value = Number(int);
//         switch(value){
//             case value < 0:
//                 return 'negative';
//             case value > 25 && value < 100:
//                 return 'mediumPositive';
//             case value >= 100:
//                 return 'largePositive';
//             default:
//                 return 'smallPositive';
//         }
//     }
//
//
//     render(){
//
//         return (
//           <Card>
//               <Row gutter={12}>
//                   <Col id='ticker'>
//                       ticker
//                   </Col>
//                   <Col id='category'>
//                       Category
//                   </Col>
//                   <Col id='%port'>
//
//                   </Col>
//                   <Col id='currentPrice'>
//                       {null}
//                   </Col>
//                   <Col id='shares'>
//
//                   </Col>
//                   <Col id='bookvalue'>
//                       {null}
//                   </Col>
//                   <Col id='currentVal'>
//                       {null}
//                   </Col>
//                   <Col id='profit'>
//                       {null}
//                   </Col>
//                   <Col id='%profit'>
//                       {null}
//                   </Col>
//               </Row>
//           </Card>
//         );
//     }
//
//
//
//
// }
