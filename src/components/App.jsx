import React, { useState, useEffect } from 'react';
import Searchbar from './Searchbar/Searchbar';
import ImageGallery from './ImageGallery/ImageGallery';
import Modal from './Modal/Modal';
import Button from './Button/Button';
import axios from 'axios';
import css from './app.module.css';
import { MagnifyingGlass } from 'react-loader-spinner';

const App = () => {
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [images, setImages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bigImageUrl, setBigImageUrl] = useState('');

  useEffect(() => {
    const makeApiCall = () => {
      if (!query) {
        return;
      }

      const PER_PAGE = 12;
      const API_KEY = '31983214-2696166acee282192c021d74b';
      const searchUrl = `https://pixabay.com/api/?q=${encodeURIComponent(
        query
      )}&page=${page}&key=${API_KEY}&image_type=photo&orientation=horizontal&per_page=${PER_PAGE}`;

      setIsLoading(true);
      axios.get(searchUrl).then(response => {
        const totalPages = Math.round(response.data.totalHits / PER_PAGE);
        const loadedImages = response.data.hits;
        setTotalPages(totalPages);
        setImages(prevImages => [...prevImages, ...loadedImages]);
        setIsLoading(false);
      });
    };
    makeApiCall();
  }, [query, page]);

  const handleSearch = searchValue => {
    if (searchValue !== '') {
      if (searchValue !== query) {
        setQuery(searchValue);
        setPage(1);
        setImages([]);
      } else {
        setQuery(searchValue);
      }
    }
  };

  const handleImageClick = bigImageUrl => {
    setBigImageUrl(bigImageUrl);
    setIsModalOpen(true);
  };

  const handleModalClickClose = event => {
    if (event.target.id === 'modal' && isModalOpen) {
      setIsModalOpen(false);
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const fetchMoreImages = () => {
    setPage(prevPage => prevPage + 1);
  };

  return (
    <div className={css.App}>
      <Searchbar onSubmit={handleSearch} />
      <ImageGallery images={images} onModalOpen={handleImageClick} />
      {isModalOpen && (
        <Modal
          bigImageUrl={bigImageUrl}
          onClose={handleModalClose}
          onClickClose={handleModalClickClose}
        />
      )}
      {isLoading && (
        <MagnifyingGlass
          visible={true}
          height="80"
          width="80"
          ariaLabel="MagnifyingGlass-loading"
          wrapperStyle={{ margin: '0 auto' }}
          wrapperClass="MagnifyingGlass-wrapper"
          glassColor="#c0efff"
          color="#e15b64"
        />
      )}

      {totalPages > 1 && page < totalPages && (
        <Button getMoreImage={fetchMoreImages} />
      )}
    </div>
  );
};

export default App;