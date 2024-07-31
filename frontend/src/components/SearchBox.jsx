import { useState } from "react"
import { useSelector } from "react-redux"
import {Form, Button} from 'react-bootstrap'
import {useParams, useNavigate} from 'react-router-dom'

const SearchBox = () => {
  const {userInfo} = useSelector(state=> state.auth)
  const {keyword: urlKeyword} = useParams()
  const navigate = useNavigate()
  const [keyword, setKeyword] = useState(urlKeyword || '');

  const submitHandler = (e) => {
    e.preventDefault();
    if(keyword.trim()) {
      setKeyword('')
      if(userInfo.role === 'Admin') {
        navigate(`/bookings/search/${keyword}`);
      } else {
        navigate(`/myorders/search/${keyword}`);
      }
    } else {
      navigate(-1)
    }
  }

  return (
    <Form onSubmit={submitHandler} className='d-flex'>
      <Form.Control
        type='text'
        name='q'
        onChange={(e) => setKeyword(e.target.value)}
        value={keyword}
        placeholder='Enter load/order'
        className='mr-sm-2 ml-sm-5'>
      </Form.Control>
      <Button type='submit' variant='outline-light' className='p-2 mx-2'>
        Search
      </Button>
    </Form>
  )
}

export default SearchBox