import React, { useState, useEffect } from 'react';
import { format, eachMonthOfInterval, compareDesc } from 'date-fns';
import { ru } from 'date-fns/locale';
import './PhotoAlbum.css';

function PhotoAlbum() {
  const [months, setMonths] = useState(() => {
    const savedMonths = localStorage.getItem('photo-album');
    return savedMonths ? JSON.parse(savedMonths) : [];
  });
  
  const startDate = new Date('2024-03-22');
  const currentDate = new Date();

  // Получаем все месяцы от даты начала до текущей даты
  const monthsArray = eachMonthOfInterval({
    start: startDate,
    end: currentDate
  }).sort(compareDesc); // Сортируем по убыванию (новые первые)

  useEffect(() => {
    localStorage.setItem('photo-album', JSON.stringify(months));
  }, [months]);

  const addPhoto = (monthIndex, photo) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setMonths(prevMonths => {
        const newMonths = [...prevMonths];
        const monthKey = format(monthsArray[monthIndex], 'yyyy-MM');
        if (!newMonths[monthKey]) {
          newMonths[monthKey] = { photos: [] };
        }
        newMonths[monthKey].photos.push({
          url: reader.result,
          title: '',
          description: '',
          date: new Date().toISOString()
        });
        return newMonths;
      });
    };
    reader.readAsDataURL(photo);
  };

  const updatePhotoDetails = (monthKey, photoIndex, details) => {
    setMonths(prevMonths => {
      const newMonths = { ...prevMonths };
      if (newMonths[monthKey]?.photos[photoIndex]) {
        newMonths[monthKey].photos[photoIndex] = {
          ...newMonths[monthKey].photos[photoIndex],
          ...details
        };
      }
      return newMonths;
    });
  };

  return (
    <div className="photo-album-container">
      <div className="photo-album-header">
        <h1>Наш Фотоальбом</h1>
        <div className="current-date">
          {format(currentDate, 'd MMMM yyyy', { locale: ru })}
        </div>
      </div>

      <div className="months-grid">
        {monthsArray.map((month, index) => {
          const monthKey = format(month, 'yyyy-MM');
          return (
            <div key={monthKey} className="month-card">
              <div className="month-header">
                <h2>{format(month, 'LLLL yyyy', { locale: ru })}</h2>
                <div className="photo-counter">
                  {months[monthKey]?.photos?.length || 0} фото
                </div>
              </div>
              
              <div className="photos-grid">
                {months[monthKey]?.photos?.map((photo, photoIndex) => (
                  <div key={photoIndex} className="photo-container">
                    <div className="photo-wrapper">
                      <img src={photo.url} alt={photo.title} />
                      <div className="photo-overlay">
                        <input
                          type="text"
                          placeholder="Название"
                          value={photo.title}
                          onChange={(e) => updatePhotoDetails(monthKey, photoIndex, { title: e.target.value })}
                          className="photo-title-input"
                        />
                        <textarea
                          placeholder="Описание"
                          value={photo.description}
                          onChange={(e) => updatePhotoDetails(monthKey, photoIndex, { description: e.target.value })}
                          className="photo-description-input"
                        />
                      </div>
                    </div>
                  </div>
                ))}
                
                <div className="add-photo">
                  <label className="add-photo-label">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => addPhoto(index, e.target.files[0])}
                      className="photo-input"
                    />
                    <span className="add-photo-text">
                      <span className="add-icon">+</span>
                      Добавить фото
                    </span>
                  </label>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default PhotoAlbum;