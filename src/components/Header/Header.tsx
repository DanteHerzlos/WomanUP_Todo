import React from 'react'
import cl from './Header.module.less'


/**
 * Header component at the top of the page.
 *
 * @component Header
 *
 */
const Header = () => {
  return (
    <div className={cl.header}>
        <h1>Todo List</h1>
    </div>
  )
}

export default Header