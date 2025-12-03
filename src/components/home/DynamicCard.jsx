// DynamicCard.jsx
import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";

import CountdownTimer from "./CountdownTimer";

const DynamicCard = ({
  item,
  timerText,
  showPrice = true,
  showLike = true,
  minHeight = "420px",
}) => {
  const navigate = useNavigate();

  useEffect(() => {
    AOS.init({ duration: 1000, once: false });
  }, []);

  if (!item) {
    return (
      <div
        className="nft__item nft__item--skeleton"
        style={{ minHeight }}
        data-aos="fade-up"
        data-aos-delay="201"
      />
    );
  }

  // Build the timer element. If there is no expiry, this will be null.
  const timerElement = timerText ?? (
    <CountdownTimer expiryDate={item.expiryDate} />
  );

  const isEmptyTimer = timerElement === null;

  return (
    <div
      className="nft__item"
      data-aos="fade-up"
      data-aos-delay="201"
      style={{ minHeight }}
    >
      <div className="author_list_pp">
        <Link
          to={`/author/${item.authorId}`}
          title={`Creator: ${item.authorId}`}
        >
          <img
            className="lazy"
            src={item.authorImage}
            alt={`${item.authorId} avatar`}
          />
          <i className="fa fa-check"></i>
        </Link>
      </div>

      <div
        className={`de_countdown${isEmptyTimer ? " de_countdown--empty" : ""}`}
      >
        {timerElement}
      </div>

      <div className="nft__item_wrap">
        <Link to={`/item-details/${item.nftId}`}>
          <img
            src={item.nftImage}
            className="lazy nft__item_preview"
            alt={item.title}
            loading="lazy"
            style={{
              objectFit: "cover",
              maxHeight: "220px",
              borderRadius: "12px",
            }}
          />
        </Link>
      </div>

      <div className="nft__item_info">
        <Link to={`/item-details/${item.nftId}`}>
          <h4>{item.title}</h4>
        </Link>
        {showPrice && <div className="nft__item_price">{item.price} ETH</div>}
        {showLike && (
          <div
            className="nft__item_like"
            onClick={() => navigate(`/item-details/${item.nftId}`)}
            style={{ cursor: "pointer" }}
          >
            <i className="fa fa-heart"></i>
            <span>{item.likes}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default DynamicCard;

/* 

import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";

import CountdownTimer from "./CountdownTimer";

const DynamicCard = ({
  item,
  timerText,
  showPrice = true,
  showLike = true,
  minHeight = "420px",
}) => {
  const navigate = useNavigate();

  useEffect(() => {
    AOS.init({ duration: 1000, once: false });
  }, []);

  if (!item) {
    return (
      <div
        className="nft__item nft__item--skeleton"
        style={{ minHeight }}
        data-aos="fade-up"
        data-aos-delay="201"
      />
    );
  }

  const finalTimerText = timerText ?? (
    <CountdownTimer expiryDate={item.expiryDate} />
  );

  return (
    <div
      className="nft__item"
      data-aos="fade-up"
      data-aos-delay="201"
      style={{ minHeight }}
    >
      <div className="author_list_pp">
        <Link
          to={`/author/${item.authorId}`}
          title={`Creator: ${item.authorId}`}
        >
          <img
            className="lazy"
            src={item.authorImage}
            alt={`${item.authorId} avatar`}
          />
          <i className="fa fa-check"></i>
        </Link>
      </div>

      {finalTimerText && <div className="de_countdown">{finalTimerText}</div>}

      <div className="nft__item_wrap">
        <Link to={`/item-details/${item.nftId}`}>
          <img
            src={item.nftImage}
            className="lazy nft__item_preview"
            alt={item.title}
            loading="lazy"
            style={{
              objectFit: "cover",
              maxHeight: "220px",
              borderRadius: "12px",
            }}
          />
        </Link>
      </div>

      <div className="nft__item_info">
        <Link to={`/item-details/${item.nftId}`}>
          <h4>{item.title}</h4>
        </Link>
        {showPrice && <div className="nft__item_price">{item.price} ETH</div>}
        {showLike && (
          <div
            className="nft__item_like"
            onClick={() => navigate(`/item-details/${item.nftId}`)}
            style={{ cursor: "pointer" }}
          >
            <i className="fa fa-heart"></i>
            <span>{item.likes}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default DynamicCard;
 */
