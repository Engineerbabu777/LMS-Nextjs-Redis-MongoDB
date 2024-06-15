import { styles } from '@/app/styles/style'
import React, { FC, useState } from 'react'
type Props = {}
export const ChangePassword: FC<Props> = props => {
  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const passwordChangeHandler = (e: any) => {}

  return <></>
}
