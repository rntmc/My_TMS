import { Alert } from 'react-bootstrap'

const Message = ({variant, children}) => { //avariant: danger, success, info - children: sth we are wrapping, like a message
  return (
    <Alert variant={variant}>
      {children}
    </Alert>
  )
}

Message.defaultProps = {
  variant: 'info',
}

export default Message