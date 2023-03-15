import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { baseURL } from '../../helpers/api';
import Modal from '../addBook/resusable/modal/Modal';
import isUserSigned from '../../helpers/auth';

import './RemoveBook.css';

const RemoveBook = () => {
  const [showModal, setShowModal] = useState({
    alert: false,
    message: '',
    type: '',
  });

  const [data, setData] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${baseURL}/books`)
      .then((response) => response.json())
      .then((data) => setData(data))
      .catch((error) => error);

    if (!isUserSigned()) {
      navigate('/signin');
    }
  }, [navigate, refresh]);

  const deleteRequestHandler = (bookId, bookName) => {
    fetch(`${baseURL}/books/${bookId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        mode: 'no-cors',
      },
      body: JSON.stringify({
        id: bookId,
      }),
    })
      .then((response) => {
        if (response.ok) {
          setShowModal({
            alert: true,
            message: `Yaaaay! You successfully deleted ${bookName}`,
            type: 'success',
          });
          setRefresh(!refresh);
        }
      })
      .catch(() => {
        setShowModal({
          alert: true,
          message: `Oops! Something went wrong with deleting ${bookName}`,
          type: 'error',
        });
      });
  };

  return (
    <>
      <div className="deletecarContainer flex flex-column center">
        <h2 className="detete-header hero">Delete Book</h2>
        <div className="grid gap">
          {data.map((book) => (
            <div key={book.id}>
              {book.images && <img src={book.images[Object.keys(book.images)[0]]} alt="book" />}
              <div className="actions flex">
                <h2>
                  {book.name}
                  {book.make}
                </h2>
                <button
                  type="button"
                  onClick={() => deleteRequestHandler(book.id, book.name)}
                >
                  Detele
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      {showModal.alert && (
        <Modal
          message={showModal.message}
          type={showModal.type}
          onClose={() => setShowModal({ alert: false })}
        />
      )}
    </>
  );
};

export default RemoveBook;