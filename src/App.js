import { useState, useEffect } from "react";

import "./App.css";
import Loader from 'react-loader-spinner';
import fetchImages from './components/services/imagesApi'
import Searchbar from "./components/Searchbar/Searchbar";
import Button from "./components/Button/Button";
import Notification from "./components/Notification/Notification";
import ImageGallery from './components/ImageGallery/ImageGallery.jsx';


export default function App() {
  const [imageName, setImageName] = useState('');
  const [page, setPage] = useState(1);
  const [images, setImages] = useState([]);
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!imageName) return;

    setStatus("pending");

    fetchImages(imageName, page)
      .then((newImages) => {
        if (newImages.total > 0) {
          setImages((prevImages) => [...prevImages, ...newImages.hits]);
          setStatus("resolved");
          page > 1 &&
            window.scrollTo({
              top: document.documentElement.scrollHeight,
              behavior: "smooth",
            });
        } else return Promise.reject(new Error("Invalid request"));
      })
      .catch((err) => {
        setError(err);
        setStatus("rejected");
      });
  }, [imageName, page, setImages]);
  
  const onClickLoadMore = () => setPage((page) => page + 1);

  const handleFormSubmit = (value) => {
    setImageName(value);
    setPage(1);
    setImages([]);
  };

  

  switch (status) {
    case 'idle':
      return (
        <div>
          <Searchbar onSubmit={handleFormSubmit} />
        </div>
      );
    case 'pending':
      return (
        <div>
          <Searchbar onSubmit={handleFormSubmit} />
          <ImageGallery images={images} />
          <Loader />
          <Button onClick={onClickLoadMore} />
        </div>
      );
      case "resolved":
      return (
        <div>
          <Searchbar onSubmit={handleFormSubmit} />
          <ImageGallery images={images} />
          <Button onClick={onClickLoadMore} />
        </div>
      );
    case 'rejected':
      return (
        <div>
          <Searchbar onSubmit={handleFormSubmit} />
          <Notification text={error.text} />
        </div>
      );
    
    default:
      return (
        <div>
        <Searchbar onSubmit={handleFormSubmit} />
        </div>
      );
  }
}
    
  
