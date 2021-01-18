const React = require('react');
const ReactDom = require('react-dom');
const { hot } = require('react-hot-loader/root');
 
const App = require('./App');
const Hot = hot(App);
 
ReactDom.render(<Hot />, document.querySelector('#root'));
