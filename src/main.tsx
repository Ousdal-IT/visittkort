import { render } from 'preact';
import { App } from './App';
import './style.css';

render(<App />, document.getElementById('app')!);

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    void navigator.serviceWorker.register(`${import.meta.env.BASE_URL}sw.js`);
  });
}
