import { createGlobalStyle } from 'styled-components';


// Light and dark mode styles

export const lightTheme = {
  body: '#FFF',
  text: '#000',
  link: '#0000EE',
  dropDown: {
    control: {
      background: '#FFF', 
      text: '#000'
    },
    menu: {
      background: '#FFF',
    },
    option: {
      text: {
        default: '#000',
        hover: '#000',
        selected: '#000'
      },
      background: {
        hover: '#f2f9fc',
        selected: '#f2f9fc'
      }
    }
  }
}

export const darkTheme = {
  body: '#2e303c',
  text: '#FAFAFA',
  link: '#3282b8',
  dropDown: {
    control: {
      background: '#2e303c', 
      text: '#FFF'
    },
    menu: {
      background: '#2e303c',
    },
    option: {
      text: {
        default: '#FFF',
        hover: '#FFF',
        selected: '#FFF'
      },
      background: {
        hover: '#464c67',
        selected: '#464c67'
      }
    }
  }
}

export const GlobalStyles = createGlobalStyle`

body {
    background: ${({ theme }) => theme.body};
    color: ${({ theme }) => theme.text};
}

a {
  color: ${({ theme }) => theme.link};
}

.Dropdown-control {
  background-color: ${({ theme }) => theme.dropDown.control.background};
  color: ${({ theme }) => theme.dropDown.control.text};
}
  
.Dropdown-menu {
  background-color: ${({ theme }) => theme.dropDown.menu.background};
}
  
.Dropdown-option {
  color: ${({ theme }) => theme.dropDown.option.text.default};
}
  
.Dropdown-option:hover {
  background-color: ${({ theme }) => theme.dropDown.option.background.hover};
  color: ${({ theme }) => theme.dropDown.option.text.hover};
}

.Dropdown-option.is-selected {
  background-color: ${({ theme }) => theme.dropDown.option.background.selected};
  color: ${({ theme }) => theme.dropDown.option.text.selected};
}
`