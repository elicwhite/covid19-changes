import { useEffect, useState } from 'react';

export const useDarkMode = () => {
    const [theme, setTheme] = useState('light');

    const toggleTheme = () => {
      if(theme === 'light'){
        setMode('dark');
      }else{
        window.localStorage.setItem('theme', 'light');
        setMode('light');
      }
    }

    const setMode = mode => {
        window.localStorage.setItem('theme', mode);
        setTheme(mode)
    }

    useEffect(() => {
        const savedTheme = window.localStorage.getItem('theme');
        if(window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches && !savedTheme){
            setMode('dark');
        }else{
            savedTheme ? setTheme(savedTheme) : setMode('light');
        }
    })

    return [theme, toggleTheme]
}