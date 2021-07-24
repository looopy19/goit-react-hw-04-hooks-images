
import { useState } from "react";

export default function Searchbar({ onSubmit}) {
  const [imageName, setImageName] = useState('');


  const handleSubmit = (e) => {
    e.preventDefault();

    if (imageName.trim() === "") {
      alert('Please enter something');
      return;
    }

    onSubmit(imageName);
    reset();
  };

  const reset = () => {
    setImageName('');
  };


    return (
      <header className='Searchbar'>
        <form className='SearchForm' onSubmit={handleSubmit}>
          <button type='submit' className='SearchForm-button'></button>
          <input
            value={imageName}
            onChange={(event) => 
            setImageName(event.currentTarget.value.toLowerCase())
            }
            className='SearchForm-input'
            type='text'
            autoComplete='off'
            autoFocus
            placeholder='Search images and photos'
          />
        </form>
      </header>
    );
}