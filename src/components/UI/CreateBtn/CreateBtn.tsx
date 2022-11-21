import React from 'react'
import cl from './CreateBtn.module.less'

interface CreateBtnProps {
  /**
   * Click on component method
   */
  onClick?: React.MouseEventHandler<HTMLDivElement>;
}

/**
 * Button component for create new item.
 *
 * @component CreateBtn
 *
 */
const CreateBtn:React.FC<CreateBtnProps> = ({onClick}) => {
  return (
    <div onClick={onClick} className={cl.btn}>+</div>
  )
}

export default CreateBtn