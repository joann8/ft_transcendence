
/// Example structure pour Context

import React, {Component, createContext } from 'react';

export const ThemeContext = createContext({}); // pas sure pour objet vide

class ThemeContextProvider extends Component {
    state = {
        isLigthTheme : true,
        light: {syntax: '#555', ui: '#ddd', bg: '#eee'},
        dark: {syntax: '#ddd', ui: '#333', bg: '#555'},
    }
    render () {
        return (
            <ThemeContext.Provider value={{...this.state}}>
                {this.props.children}
            </ThemeContext.Provider>
        )
    }
}

export default ThemeContextProvider;