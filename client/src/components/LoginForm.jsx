const LoginForm = ({
  handleLogin,
  username,
  setUsername,
  password,
  setPassword,
}) => {
  return (
    <>
      <form onSubmit={handleLogin}>
        <div className='form-group'>
          <label htmlFor='username'>Username: </label>
          <input
            type='text'
            id='username'
            value={username}
            name='Username'
            onChange={(event) => setUsername(event.target.value)}
          />
        </div>

        <div className='form-group'>
          <label htmlFor='password'>Password: </label>
          <input
            type='text'
            id='password'
            value={password}
            name='Password'
            onChange={(event) => setPassword(event.target.value)}
          />
        </div>
        <button type='submit'>log in</button>
      </form>
    </>
  );
};

export default LoginForm;
